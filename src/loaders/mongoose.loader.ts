/**
 * mongoose loader
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import mongoose from 'mongoose';
import config from '@/config';
import logger from '@/libs/logger'

/**
 * Load mongoose and connect to database
 */
export default async (): Promise<void> => {
    try {

        await mongoose.connect(config.mongodb.uri, {
            user: config.mongodb.user,
            pass: config.mongodb.password
        });
        logger.info('\n' +
            '#####################################\n' +
            '#         Mongoose connected        #\n' +
            '#####################################\n'
        );
    } catch (err) {
        throw err;
        // return connection.connection.db;
    }
}