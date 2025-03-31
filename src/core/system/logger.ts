import fs from 'fs';
import path from 'path';
import Common from '@core/system/common';
import LoggerConfig from '@app/config/logger';
import OryxDate from '@core/system/date';

export default class Logger {
    private static logDir = LoggerConfig.logDir;
    private static logLevels = ['info', 'error', 'warn'];
    public static env = Common.env('APP_ENV', 'development');

    public static init() {
        if (!fs.existsSync(Logger.logDir))
            fs.mkdirSync(Logger.logDir, { recursive: true });

        Logger.logLevels.forEach((level) => {
            const levelDir = path.join(Logger.logDir, level);
            if (!fs.existsSync(levelDir))
                fs.mkdirSync(levelDir, { recursive: true });
        });
    }

    private static getLogFile(level: string): string {
        const today = OryxDate.now().format().split(' ')[0];
        return path.join(Logger.logDir, level, `${today}.log`);
    }

    public static log(level: 'info' | 'error' | 'warn', ...args: any[]) {
        const date = OryxDate.now().format();

        const message = args
            .map((arg) => {
                if (arg instanceof Error) {
                    return `Error: ${arg.message}\nStack: ${arg.stack}`;
                } else if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                } else {
                    return String(arg);
                }
            })
            .join(' | ');

        const logMessage = `[Oryx][${date}] [${level.toUpperCase()}] ${message}\n`;
        const logFile = Logger.getLogFile(level);

        fs.appendFileSync(logFile, logMessage, 'utf8');

        if (Logger.env === 'development' || Logger.env === 'testing') {
            process[level === 'error' ? 'stderr' : 'stdout'].write(logMessage);
        } else {
            if (level === 'info') {
                process.stdout.write(logMessage);
            }
        }
    }

    public static info(...args: any[]) {
        Logger.log('info', ...args);
    }

    public static error(...args: any[]) {
        Logger.log('error', ...args);
    }

    public static warn(...args: any[]) {
        Logger.log('warn', ...args);
    }

    public static cleanEmptyLogs() {
        Logger.logLevels.forEach((level) => {
            const levelDir = path.join(Logger.logDir, level);
            fs.readdirSync(levelDir).forEach((file) => {
                const filePath = path.join(levelDir, file);
                if (fs.statSync(filePath).size === 0) fs.unlinkSync(filePath);
            });
        });
    }
}
