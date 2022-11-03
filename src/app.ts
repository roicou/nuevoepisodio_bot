/**
 * Bot de Telegram
 * @author Roi C.
 * @version 1.0.0
 * @license MIT
 */
import loaders from '@/loaders'
import logger from '@/libs/logger'
import { Telegraf } from 'telegraf';
import config from '@/config';
import CustomContext from './interfaces/customcontext.interface';


void (async () => {
    try {
        const bot: Telegraf<CustomContext> = new Telegraf(config.telegram.token);
        await loaders(bot);
        await bot.launch();
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
        logger.info('\n' +
            '#####################################\n' +
            '#           Telegraf loaded         #\n' +
            '#####################################\n'
        );
        logger.info('\n##            APP Started          ##\n');
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
})();