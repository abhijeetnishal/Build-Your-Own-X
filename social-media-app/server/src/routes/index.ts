import express from "express";
import userRouter from './user';
import error from "../middlewares/error";

const app = express();

// User router  
app.use('/api/v1/user', userRouter);

// Error middleware
app.use(error);

module.exports = app;