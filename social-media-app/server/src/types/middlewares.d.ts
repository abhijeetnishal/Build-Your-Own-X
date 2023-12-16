import { Request, Response, NextFunction } from "express";

export type HandlerFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

export type ErrorMiddleware = {
    success: boolean;
    code: number;
    data: object;
    message: string;
    stack?: object;
    statusCode?: number;
};
