import { Router, Request, Response, NextFunction } from 'express';
import Logger from '@core/system/logger';
import {
    RoutesMethod,
    RoutesMiddleware,
    RouteHandler,
    RouteDefinition,
} from '@type/core/system-routes';

export default class Routes {
    private static routes: RouteDefinition[] = [];
    private static prefix = '';
    private static groupMiddlewares: RoutesMiddleware[] = [];

    static add(
        methods: RoutesMethod | RoutesMethod[],
        path: string,
        handler: RouteHandler,
        middlewares: RoutesMiddleware[] = [],
    ) {
        const methodArray = Array.isArray(methods) ? methods : [methods];
        const fullPath = `${this.prefix}${path}`.replace(/\/+/g, '/');

        this.routes.push({
            methods: methodArray,
            path: fullPath,
            handler,
            middlewares: [...this.groupMiddlewares, ...middlewares],
        });
    }

    static get(
        path: string,
        handler: RouteHandler,
        middlewares: RoutesMiddleware[] = [],
    ) {
        this.add('get', path, handler, middlewares);
    }

    static post(
        path: string,
        handler: RouteHandler,
        middlewares: RoutesMiddleware[] = [],
    ) {
        this.add('post', path, handler, middlewares);
    }

    static put(
        path: string,
        handler: RouteHandler,
        middlewares: RoutesMiddleware[] = [],
    ) {
        this.add('put', path, handler, middlewares);
    }

    static delete(
        path: string,
        handler: RouteHandler,
        middlewares: RoutesMiddleware[] = [],
    ) {
        this.add('delete', path, handler, middlewares);
    }

    static patch(
        path: string,
        handler: RouteHandler,
        middlewares: RoutesMiddleware[] = [],
    ) {
        this.add('patch', path, handler, middlewares);
    }

    static options(
        path: string,
        handler: RouteHandler,
        middlewares: RoutesMiddleware[] = [],
    ) {
        this.add('options', path, handler, middlewares);
    }

    static head(
        path: string,
        handler: RouteHandler,
        middlewares: RoutesMiddleware[] = [],
    ) {
        this.add('head', path, handler, middlewares);
    }

    static group(
        prefix: string,
        callback: () => void,
        middlewares: RoutesMiddleware[] = [],
    ) {
        const previousPrefix = this.prefix;
        const previousMiddlewares = this.groupMiddlewares;

        this.prefix = `${previousPrefix}${prefix}`.replace(/\/+/g, '/');
        this.groupMiddlewares = [...previousMiddlewares, ...middlewares];

        callback();

        this.prefix = previousPrefix;
        this.groupMiddlewares = previousMiddlewares;
    }

    static async apply(router: Router) {
        for (const route of this.routes) {
            let handlerFunction: any;

            if (typeof route.handler === 'function') {
                handlerFunction = route.handler;
            } else if (
                Array.isArray(route.handler) &&
                route.handler.length === 2
            ) {
                const [Controller, method] = route.handler;
                if (typeof Controller[method] !== 'function') {
                    Logger.error(
                        `Method ${method} not found in controller ${Controller.name}`,
                    );
                }
                handlerFunction = Controller[method].bind(Controller);
            } else {
                Logger.error(`Invalid handler format for route: ${route.path}`);
            }

            for (const method of route.methods) {
                router[method](
                    route.path,
                    ...(route.middlewares || []),
                    async (req: Request, res: Response, next: NextFunction) => {
                        try {
                            const result =
                                handlerFunction.length === 3
                                    ? handlerFunction(req, res, next)
                                    : handlerFunction(req, res);
                            if (result instanceof Promise) await result;
                        } catch (error: any) {
                            Logger.error(
                                `Error in route ${method.toUpperCase()} ${route.path}: ${error.message}`,
                            );
                            next(error);
                        }
                    },
                );
            }
        }
    }
}
