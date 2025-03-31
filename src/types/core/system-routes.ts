import { Request, Response, NextFunction } from 'express';

export type RoutesMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

export type RoutesMethod =
    | 'get'
    | 'post'
    | 'put'
    | 'patch'
    | 'delete'
    | 'options'
    | 'head'
    | 'all';

export type RouteHandler =
    | ((req: Request, res: Response, next?: NextFunction) => any)
    | [any, string];

export interface RouteDefinition {
    methods: RoutesMethod[];
    path: string;
    handler: RouteHandler;
    middlewares?: RoutesMiddleware[];
}
