import http from 'http';
import OryxExpress from '@core/module/express';
import Common from '@core/system/common';
import Logger from '@core/system/logger';

export default class OryxServer {
    public static server: http.Server = http.createServer(OryxExpress.express);
    private static serverPort: number = Number(Common.env('APP_PORT', 3000));
    private static serverUrl: string = Common.env(
        'APP_URL',
        'http://localhost',
    );

    public static start() {
        this.server.listen(this.serverPort, () => {
            Logger.info(
                `Server is already running : ${this.serverUrl}:${this.serverPort}`,
            );
        });
    }
}
