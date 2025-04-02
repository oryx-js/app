import express, { Express, Router, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Routes from '@core/system/routes';
import { expressCors } from '@app/config/cors';
import '@app/routes/regist';
import HttpMiddlewares from '@app/http/middlewares/regist';

export default class OryxExpress {
    public static express: Express = express();
    private static router: Router = express.Router();

    public static start() {
        this.middlewares();
        this.routes();
    }

    private static middlewares() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(cookieParser());
        this.express.use(cors(expressCors));

        // Setup EJS
        this.express.set(
            'views',
            path.join(__dirname, '../../../public/views'),
        );
        this.express.set('view engine', 'ejs');

        // Serve static files properly
        this.express.use(
            '/static',
            express.static(path.join(__dirname, '../../../public/static')),
        );

        HttpMiddlewares.register();
    }

    private static routes() {
        Routes.apply(this.router);
        this.express.use(this.router);
    }

    public static resJson(
        res: Response,
        arg1:
            | boolean
            | {
                  status: boolean;
                  code: number;
                  message: string;
                  result: object | null;
                  custom?: object;
              },
        arg2?: number,
        arg3?: string,
        arg4?: object | any[] | null,
        arg5?: Partial<Record<string, any>>,
    ): Response {
        const response =
            typeof arg1 === 'object'
                ? { ...arg1, ...arg1.custom }
                : {
                      status: arg1,
                      code: arg2!,
                      message: arg3!,
                      result: arg4!,
                      ...arg5,
                  };

        return res.status(response.code).json(response);
    }

    public static resView(
        res: Response,
        view: string,
        data: Record<string, any> = {},
        status: number = 200,
    ): void {
        try {
            res.status(status).render(
                path.join(__dirname, `../../../public/views/${view}.ejs`),
                data,
            );
        } catch (error: any) {
            this.resJson(res, false, 500, 'Failed to render view');
        }
    }
}
