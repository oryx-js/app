import { DataSource } from 'typeorm';
import Common from '@core/system/common';
import { DBCommonConfig, DBMySQLConfig } from '@app/config/database';
import Logger from '@core/system/logger';

const DBType = Common.env<string>('DB_TYPE', 'mysql');
const CommonConfig = DBCommonConfig;
const ByConfig: Record<string, any> = {
    mysql: DBMySQLConfig,
};

if (!ByConfig[DBType]) {
    Logger.error(`Unsupported DB_TYPE: ${DBType}`);
}

const Database = new DataSource({
    type: DBType,
    ...CommonConfig,
    ...ByConfig[DBType],
});

const DatabaseInit = async () => {
    Common.handler(
        async () => {
            await Database.initialize();
            Logger.info(`Database successfully connected`);
            Logger.info(`Database type: ${DBType}`);
        },
        (error) => {
            Logger.error(`Database failed to connect: ${error}`);
        },
    );
};

export { Database, DatabaseInit };
