import winston from 'winston';
import config from '@/config';
// import { DateTime, Settings } from 'luxon';
// Settings.defaultZone = 'Europe/Madrid';
import 'winston-daily-rotate-file';
import path from 'path';


const format_log = winston.format.combine(
    winston.format.errors({
        stack: true,
        metadata: true
    }),
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => {
        if (info.level.indexOf("error") > -1) {
            return `${info.timestamp} ${info.level}: ${info.stack}`;
        }
        return `${info.timestamp} ${info.level}: ${info.message}`;
    })
);

const format_display = winston.format.combine(
    winston.format.errors({
        stack: true,
        metadata: true
    }),
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.colorize({
        all: true
    }),
    winston.format.printf(info => {
        if (info.level.indexOf("error") > -1) {
            return `${info.timestamp} ${info.level}: ${info.stack}`;
        }
        return `${info.timestamp} ${info.level}: ${info.message}`;
    })
)
const transport_all = new winston.transports.DailyRotateFile({
    filename: path.join(process.cwd(), config.logs.log_path, '%DATE%-error.log'),
    // datePattern: 'year-month-week'
    datePattern: 'YYYY-MM_WW',
    level: 'error',
    zippedArchive: true,
});

const transport_error = new winston.transports.DailyRotateFile({
    filename: path.join(process.cwd(), config.logs.log_path, '%DATE%-all.log'),
    // filename: '%DATE%-app.log',
    datePattern: 'YYYY-MM_WW',
    zippedArchive: true
});


const transports = [];
if (config.debug) {
    transports.push(
        new winston.transports.Console({
            format: format_display
        })
    );
// } else {
    transports.push(transport_all, transport_error);
    transport_all.on('rotate', () => {
        // do something fun
    });
    transport_error.on('rotate', () => {
        // do something fun
    });
    // new winston.transports.File({
    //     filename: `${config.logs.log_path}/${DateTime.local().toFormat('yyyy-MM-dd_HHmmss')}-error.log`,
    //     level: 'error'
    // }),
    // new winston.transports.File({
    //     filename: `${config.logs.log_path}/${DateTime.local().toFormat('yyyy-MM-dd_HHmmss')}-all.log`,
    // }),
}


const LoggerInstance = winston.createLogger({
    level: (config.debug) ? 'debug' : 'info',
    format: format_log,
    transports
});


export default LoggerInstance;
