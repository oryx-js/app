import Common from '@core/system/common';

/** common/default config */
const DBCommonConfig = {
    entities: [
        Common.env<string>('APP_ENV', 'development') === 'development'
            ? 'src/app/database/entities/*.ts'
            : 'dist/app/database/entities/*.js',
    ],
    synchronize: Common.env<string>('DB_SYNC', 'off') === 'on',
    logging: Common.env<string>('DB_LOGGING', 'off') === 'on',
    charset: Common.env<string>('DB_CHARSET', 'utf8mb4_general_ci'),
};

/** Config by type */
const DBMySQLConfig = {
    host: Common.env<string>('DB_HOST', 'localhost'),
    port: Common.env<number>('DB_PORT', 3306),
    username: Common.env<string>('DB_USER', 'root'),
    password: Common.env<string>('DB_PASS', ''),
    database: Common.env<string>('DB_NAME', ''),
};

export { DBCommonConfig, DBMySQLConfig };
