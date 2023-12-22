import express from "express";
import userRouter from './user';
import errorMiddleware from "../middlewares/error";
import postRouter from "./post";

// Create an express instance
const app = express();

// User router  
app.use('/api/v1/user', userRouter);

// Post router
app.use('/api/v1/post', postRouter);

// Error middleware
app.use(errorMiddleware);

module.exports = app;