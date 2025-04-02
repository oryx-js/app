import { DataSource } from 'typeorm';
import Common from '@core/system/common';
import { DBCommonConfig, DBMySQLConfig } from '@app/config/database';
import Logger from '@core/system/logger';
import runSeeders from '@app/database/seeders/regist';

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

const DatabaseInit = () => {
    return new Promise<void>((resolve, reject) => {
        const initDatabase = async () => {
            try {
                await Database.initialize();
                Logger.info(`Database successfully connected`);
                Logger.info(`Database type: ${DBType}`);

                setTimeout(async () => {
                    try {
                        await runSeeders();
                        resolve();
                    } catch (seederError) {
                        reject(seederError);
                    }
                }, 100);
            } catch (error) {
                Logger.error(`Database failed to connect: ${error}`);
                reject(error);
            }
        };

        initDatabase();
    });
};

export { Database, DatabaseInit };
