/**
 * TMDB loaders
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import tmdbService from '@/services/tmdb.service';
import cron from 'node-cron';
import config from '@/config';
import logger from '@/libs/logger';

/**
 * Load TMDB with cron job to update shows
 */
export default async (): Promise<void> => {
    // cron job to update the movie list every day at 2:00 AM
    await tmdbService.updateShows();
    cron.schedule('0 0 * * *', async () => {
        try {
            await tmdbService.updateShows();
        } catch (error) {
            logger.error(error);
        }
    }, {
        scheduled: true,
        timezone: config.timezone
    });

};