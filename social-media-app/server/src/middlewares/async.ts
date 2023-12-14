import { NextFunction, Request } from "express";

function asyncMiddleware(handler: Function) {
    return async (req: Request, res: any, next: NextFunction) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            if (next) {
                next(error);
            }
            else {
                res(error);
            }
        }
    };
};

export default asyncMiddleware