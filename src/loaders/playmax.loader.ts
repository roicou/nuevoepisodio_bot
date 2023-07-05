/**
 * TMDB loaders
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import cron from 'node-cron';
import config from '@/config';
import playmaxService from '@/services/playmax.service';
import logger from '@/libs/logger';

/**
 * Load TMDB with cron job to update shows
 */
export default async (): Promise<void> => {
    // cron job to update the movie list every day at 2:00 AM

    await loader();
    cron.schedule('0 0 * * *', async () => {
        await loader();
    }, {
        scheduled: true,
        timezone: config.timezone
    });

};
async function loader(): Promise<void> {
    try {
        await playmaxService.deleteOldReleases();
    } catch (error) {
        logger.error(error);
    }
    try {
        await playmaxService.nextReleases();
    } catch (error) {
        logger.error(error);
    }
}