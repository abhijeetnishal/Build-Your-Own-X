import { NextFunction, Request, Response } from "express";

function error(err: any, req: Request, res: Response, next: NextFunction) {
    //Log Error
    const errStatus = err.statusCode || 400;

    let error: any = {};
    error.success = err.success || false;
    error.code = errStatus;
    error.data = err.data || {};
    
    if (process.env.NODE_ENV === "development" && error.success === false) {
      error.stack = err.stack || {};
    }
  
    if (err.message) {
      error.message = err.message || "Something went wrong";
    } else {
      error.message = err || "Something went wrong";
    }
  
    res.status(200).json(error);
  };
  

export default error