import express from "express";
import userRouter from './user';
import errorMiddleware from "../middlewares/error";

// Create an express instance
const app = express();

// User router  
app.use('/api/v1/user', userRouter);

// Error middleware
app.use(errorMiddleware);

module.exports = app;