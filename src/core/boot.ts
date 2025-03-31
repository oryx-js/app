import OryxExpress from '@core/module/express';
import OryxServer from '@core/system/server';
import Logger from '@core/system/logger';
import { DatabaseInit } from './module/typeorm';

export default class OryxBoot {
    public static start() {
        (async () => {
            Logger.init();
            await DatabaseInit();
            OryxExpress.start();
            OryxServer.start();
        })();
    }
}
