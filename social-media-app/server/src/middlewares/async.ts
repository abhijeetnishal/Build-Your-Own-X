import { NextFunction, Request, Response } from "express";
import { HandlerFunction } from "../types/middlewares";

// This asyncMiddleware function wraps your handler(function) and provides error handling logic, 
// making your code cleaner and more maintainable.
function asyncMiddleware(handler: HandlerFunction) {
    // asyncMiddleware returns another anonymous async function
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            if (next) {
                next(error);
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    };
}

export default asyncMiddleware;
