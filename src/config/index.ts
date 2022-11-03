import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    /**
     * telegram
     */
    telegram: {
        token: process.env.TELEGRAM_TOKEN,
    },

    /**
     * debug mode
     */
    debug: process.env.DEBUG === "true",

    /**
 * logs config
 */
    logs: {
        log_path: process.env.LOG_PATH || "logs",
        compress_before_days: process.env.COMPRESS_BEFORE_DAYS || 3,
        cron_hour: process.env.CRON_HOUR || 3
    },
    /**
     * mongoose
     */
    mongodb: {
        uri: process.env.MONGODB_URI,
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD
    },

    /**
     * tmdb
     * https://www.themoviedb.org/settings/api
     * https://developers.themoviedb.org/3/getting-started/introduction
     */
    tmdb: {
        url: process.env.TMDB_URL,
        api_key: process.env.TMDB_API_KEY
    }
};