import { Request, Response } from 'express';
import Routes from '@core/system/routes';
import OryxExpress from '@core/module/express';

Routes.get('/', (req: Request, res: Response) => {
    OryxExpress.resJson(res, true, 200, 'Success');
});
