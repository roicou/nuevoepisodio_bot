/**
 * index of loaders
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
// import logger from '@/libs/logger';
import mongooseLoader from '@/loaders/mongoose.loader';
import telegrafLoader from '@/loaders/telegraf.loader';
import { Telegraf } from 'telegraf';
import CustomContext from '@/interfaces/customcontext.interface';
import tmdbLoader from '@/loaders/tmdb.loader';
import playmaxLoader from './playmax.loader';

/**
 * Load all loaders
 * @param bot
 */
export default async (bot: Telegraf<CustomContext>): Promise<void> => {
    // eslint-disable-next-line no-useless-catch
    try {
        await mongooseLoader();
        await telegrafLoader(bot);
        await playmaxLoader();
        await tmdbLoader();
    } catch (error) {
        throw error;
    }
}