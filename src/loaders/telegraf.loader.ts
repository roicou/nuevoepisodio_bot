/**
 * telegraf loaders
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
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

/**
 * load all bot loaders before launch. Receibes texts, commands, etc.
 * @param bot bot instance
 */
export default async (bot: Telegraf<CustomContext>): Promise<void> => {
    // middleware
    bot.use(middleware);

    commands(bot);

    // for reply to messages
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

    // for reply to buttons selections
    bot.on('callback_query', async (ctx: CustomContext) => {
        try {
            const data = ctx.callbackQuery.data;
            const query = data.split(':')[0] || null;
            const value = parseInt(data.split(':')[1]) || null;
            if (!value || isNaN(value)) {
                throw new Error('id is not a number');
            }
            switch (query) {
                case 'newshow':
                    return telegrafService.addNewShow(ctx, value);
                case 'deleteshow':
                    return telegrafService.deleteUserShow(ctx, value);
                case 'settings':
                    return telegrafService.updateUserNotificationTime(ctx, value);
            }
        } catch (error) {
            logger.error("callback_query error: " + error);
        }

    });

    // cron jobs
    cron.schedule('0 * * * *', async () => {
        try {
            await telegrafService.sendTodayEpisodes(bot, parseInt(DateTime.local().toFormat('HH')))//parseInt(DateTime.local().toFormat('HH')));
        } catch (error) {
            logger.error(error);
        }
    });

}