import logger from '@/libs/logger';
import mongooseLoader from '@/loaders/mongoose.loader';
import telegrafLoader from '@/loaders/telegraf.loader';
import { Telegraf } from 'telegraf';
import CustomContext from '@/interfaces/customcontext.interface';
import tmdbLoader from '@/loaders/tmdb.loader';

export default async (bot: Telegraf<CustomContext>) => {
    try {
        await mongooseLoader();
        await telegrafLoader(bot);
        await tmdbLoader();
    } catch (error) {
        throw error;
    }
}