// Import express to use router method
import express from "express";
import isAuthenticated from "../middlewares/auth";

import {
  getUserPosts,
  createPost,
  updateSpecificPost,
  deleteSpecificPost,
  schedulePost,
} from "../controllers/postController";

// express.Router() is a method in the Express.js that  Creates a new router object.
// It is used to define routes for a specific endpoint.
const postRouter = express.Router();

// isAuthenticated is a middleware to check user is authenticated or not
// Create an endpoint for getting all posts of user.
postRouter.get("/:id", isAuthenticated, getUserPosts);

// Create an endpoint for Creating a post.
postRouter.post("/:id", isAuthenticated, createPost);

// Create an endpoint for schedule posts
postRouter.post("/schedule/:id", isAuthenticated, schedulePost)

// Create an endpoint for updating a post.
postRouter.patch("/:id", isAuthenticated, updateSpecificPost);

// Create an endpoint for deleting a post
postRouter.delete("/:id", isAuthenticated, deleteSpecificPost);

export default postRouter;
