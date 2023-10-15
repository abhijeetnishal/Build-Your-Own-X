import express from "express";
import blogController from "../controllers/blogController";

//create a router for blog posts
const blogRouter = express.Router();

//create an endpoint to get all the blog posts
blogRouter.get('/posts', blogController.getAllBlogPosts);

export default blogRouter;