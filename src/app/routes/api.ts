import { RouteHTTPHandler } from '@type/core/system-routes';
import OryxExpress from '@core/module/express';
import Routes from '@core/system/routes';

Routes.group('/api', () => {
    Routes.get('/sample', ({ response }: RouteHTTPHandler) => {
        OryxExpress.resJson(response, true, 200, 'Success');
    });
});
