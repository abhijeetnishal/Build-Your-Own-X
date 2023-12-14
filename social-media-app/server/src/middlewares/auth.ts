import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get access token from request header
        const token = req.header("x-auth-token");

        // Check token is exists or not
        if(!token) {
            return res.status(401).json({
                message: "Authentication token is missing",
            });
        }
        else{
            // Check user is authenticated or not
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if(decoded){
                next();
            }
            else {
                return res.status(401).json({
                    message: "Invalid token",
                });
            }
        }
    } 
    catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  
}

export default isAuthenticated;