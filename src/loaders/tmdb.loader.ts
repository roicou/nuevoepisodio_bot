import tmdbService from '@/services/tmdb.service';
import cron from 'node-cron';
import config from '@/config';
import logger from '@/libs/logger';

export default async () => {
    // cron job to update the movie list every day at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
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