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
            const data_splited = data.split(':');
            const query = data_splited.shift() || null;
            if (query) {
                const value = data_splited.pop() || null;
                const subquery = (data_splited.length) ? data_splited : null;
                let id: number;
                switch (query) {
                    case 'newshow':
                        id = parseInt(value);
                        return telegrafService.addNewShow(ctx, id);
                    case 'deleteshow':
                        id = parseInt(value);
                        return telegrafService.deleteUserShow(ctx, id);
                    case 'settings':
                        id = parseInt(value);
                        return telegrafService.updateUserNotificationTime(ctx, subquery[0], id);
                }
            }
        } catch (error) {
            logger.error("callback_query error: " + error);
        }

    });

    // cron jobs
    cron.schedule('0 * * * *', async () => {
    try {
        logger.info('cron job de enviar episodios');
        await telegrafService.sendCronEpisodes(bot, parseInt(DateTime.local().toFormat('HH')))//parseInt(DateTime.local().toFormat('HH')));
    } catch (error) {
        logger.error(error);
    }
    });

}