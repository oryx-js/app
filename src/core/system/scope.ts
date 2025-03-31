import Logger from '@core/system/logger';
import Common from '@core/system/common';

/** before start system */
Logger.init();
process.env.TZ = Common.env<string>('APP_TIMEZONE', 'UTC');

/** handle logging for specific scopes */
const nativeConsoleError = console.error;
const nativeConsoleWarn = console.warn;
const nativeConsoleLog = console.log;

console.error = (...args: any[]) => {
    Logger.error(...args);
    nativeConsoleError(...args);
};

console.warn = (...args: any[]) => {
    Logger.warn(...args);
    if (Logger.env === 'development') {
        nativeConsoleWarn(...args);
    }
};

console.log = (...args: any[]) => {
    Logger.info(...args);
    if (Logger.env === 'development' || Logger.env === 'testing') {
        nativeConsoleLog(...args);
    }
};

process.on('unhandledRejection', (reason, promise) => {
    Logger.error({
        type: 'Unhandled Rejection',
        reason,
        promise,
        stack: reason instanceof Error ? reason.stack : undefined,
    });

    if (Logger.env === 'development') {
        nativeConsoleError('Unhandled Rejection:', reason);
    }
});

process.on('uncaughtException', (error: Error) => {
    Logger.error({
        type: 'Uncaught Exception',
        message: error.message,
        stack: error.stack,
    });

    if (Logger.env === 'development') {
        nativeConsoleError('Uncaught Exception:', error);
    }

    process.exit(1);
});

process.on('warning', (warning) => {
    Logger.warn({
        type: 'Process Warning',
        message: warning.message,
        stack: warning.stack,
    });

    if (Logger.env === 'development') {
        console.warn('Process Warning:', warning);
    }
});

process.on('multipleResolves', (type, promise, reason) => {
    Logger.error({
        type: 'Multiple Resolves',
        resolveType: type,
        promise,
        reason,
    });

    if (Logger.env === 'development') {
        console.error('Multiple Resolves:', type, reason);
    }
});

process.on('rejectionHandled', (promise) => {
    Logger.warn({
        type: 'Rejection Handled Late',
        promise,
    });

    if (Logger.env === 'development') {
        console.warn('Rejection Handled Late:', promise);
    }
});

process.on('SIGINT', () => {
    Logger.info('Process terminated (SIGINT)');
    process.exit(0);
});

process.on('SIGTERM', () => {
    Logger.info('Process terminated (SIGTERM)');
    process.exit(0);
});

process.on('beforeExit', (code) => {
    Logger.info(`Process before exit with code: ${code}`);
});

process.on('exit', (code) => {
    Logger.info(`Process exited with code: ${code}`);
});
