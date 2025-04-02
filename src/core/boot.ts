import OryxExpress from '@core/module/express';
import OryxServer from '@core/system/server';
import Logger from '@core/system/logger';
import { DatabaseInit } from '@core/module/typeorm';

export default class OryxBoot {
    public static start() {
        DatabaseInit()
            .then(() => {
                OryxExpress.start();
                OryxServer.start();
            })
            .catch((error) => {
                Logger.error(`Failed to initialize application: ${error}`);
                process.exit(1);
            });
    }
}
