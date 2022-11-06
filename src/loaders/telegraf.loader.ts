import { Telegraf } from 'telegraf';
import CustomContext from '@/interfaces/customcontext.interface';
import middleware from '@/bot/middleware';
import logger from '@/libs/logger';
import commands from '@/bot';
import cron from 'node-cron';
import telegrafService from '@/services/telegraf.service';
import { DateTime, Settings } from 'luxon';
Settings.defaultZone = 'Europe/Madrid';
import { Message } from 'typegram'

export default async (bot: Telegraf<CustomContext>) => {
    bot.use(middleware);
    commands(bot);

    bot.on('text', async (ctx: CustomContext) => {
        try {
            const message = ctx.message as Message.TextMessage;
            const reply = message.reply_to_message as Message.TextMessage;
            if (reply && reply.from.id === ctx.botInfo.id) {
                switch (reply.text) {
                    case 'Escribe el nombre de la serie':
                        return telegrafService.findShowByName(ctx);
                }
            }
        } catch (error) {
            logger.error("text error: " + error);
        }
    });

    bot.on('callback_query', async (ctx: CustomContext) => {
        try {
            const data = ctx.callbackQuery.data;
            const query = data.split(':')[0] || null;
            const id = parseInt(data.split(':')[1]) || null;
            if(isNaN(id)) {
                throw new Error('id is not a number');
            }
            switch (query) {
                case 'newshow':
                    return telegrafService.addNewShow(ctx, id);
                case 'deleteshow':
                    return telegrafService.deleteUserShow(ctx, id);
            }
        } catch (error) {
            logger.error("callback_query error: " + error);
        }

    });


    // cron at 10:00 AM
    cron.schedule('0 * * * *', async () => {
        try {
            await telegrafService.sendTodayEpisodes(bot, 10)//parseInt(DateTime.local().toFormat('HH')));
        } catch (error) {
            logger.error(error);
        }
    });

}