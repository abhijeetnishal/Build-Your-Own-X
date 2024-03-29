import asyncMiddleware from "../middlewares/async";
import { NextFunction, Request, Response } from "express";
import {
  savePost,
  getAllPosts,
  getPostDetails,
  updatePost,
  deletePost,
  getAllFollowingUsersPosts,
  saveSchedulePost,
} from "../service/postService";
import mongoose, { isValidObjectId } from "mongoose";
import { getUserDetails } from "../service/userService";
import { task } from "../config/cronjobScheduler";

const getUserPosts = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get userId from req
      const userId = req.params.id;

      // Check if Object id is valid or not
      if (isValidObjectId(userId)) {
        const userExist = await getUserDetails({ "author._id": userId });

        // Check if user registered or not
        if (userExist) {
          // Get user posts
          const userPosts = await getAllPosts({ "author._id": userId });

          return next({
            success: true,
            statusCode: 200,
            data: userPosts,
            message: "Users posts",
          });
        } else {
          return next({
            statusCode: 400,
            message: "User doesn't exist",
          });
        }
      } else {
        return next({
          statusCode: 401,
          message: "Invalid mongo object Id",
        });
      }
    } catch (error) {
      return next({
        statusCode: 500,
        message: error.message,
      });
    }
  }
);

const followingUsersPosts = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user Id from req
      const userId = req.params.id;

      // Check user Id is present or not
      if (userId) {
        // Check Id's are valid or not
        if (isValidObjectId(userId)) {
          // Check if user exists or not
          const userExist = await getUserDetails({ _id: userId });

          if (userExist) {
            const posts = await getAllFollowingUsersPosts({
              followeeId: new mongoose.Types.ObjectId(userId),
            });

            return next({
              statusCode: 200,
              success: true,
              data: posts,
              message: "Following users posts",
            });
          } else {
            return next({
              statusCode: 401,
              message: "User User doesn't exist",
            });
          }
        } else {
          return next({
            statusCode: 401,
            message: "Invalid mongo object Id",
          });
        }
      } else {
        return next({
          statusCode: 400,
          message: "Require user Id",
        });
      }
    } catch (error) {
      return next({
        statusCode: 500,
        message: error.message,
      });
    }
  }
);

const createPost = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get userId from req
      const userId = req.params.id;

      // Check if Object id is valid or not
      if (isValidObjectId(userId)) {
        const userExist = await getUserDetails({ _id: userId });

        // Check if user registered or not
        if (userExist) {
          // Get data from req
          const { postDetails } = req.body;

          // Check content is present or not
          if (!postDetails) {
            // Bad request (400)
            return next({
              statusCode: 400,
              message: "enter content data",
            });
          } else {
            // Create post
            const newPost = await savePost(postDetails);

            return next({
              success: true,
              statusCode: 200,
              message: "Post created",
              data: newPost,
            });
          }
        } else {
          return next({
            statusCode: 400,
            message: "User doesn't exist",
          });
        }
      } else {
        return next({
          statusCode: 401,
          message: "Invalid mongo object Id",
        });
      }
    } catch (error) {
      return next({
        statusCode: 500,
        message: error.message,
      });
    }
  }
);

const schedulePost = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get userId from req
      const userId = req.params.id;

      // Check if Object id is valid or not
      if (isValidObjectId(userId)) {
        const userExist = await getUserDetails({ _id: userId });

        // Check if user registered or not
        if (userExist) {
          // Get data from req
          const { postDetails } = req.body;

          // Check content is present or not
          if (!postDetails) {
            // Bad request (400)
            return next({
              statusCode: 400,
              message: "enter post details",
            });
          } else {
            const scheduledPost = await saveSchedulePost(postDetails);
            task.start();

            return next({
              statusCode: 200,
              success: true,
              data: scheduledPost,
              message: "Post scheduled",
            });
          }
        } else {
          return next({
            statusCode: 400,
            message: "User doesn't exist",
          });
        }
      } else {
        return next({
          statusCode: 401,
          message: "Invalid mongo object Id",
        });
      }
    } catch (error) {
      return next({
        statusCode: 500,
        message: error.message,
      });
    }
  }
);

const updateSpecificPost = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get post Id from params
      const postId = req.params.id;

      // Check postId exists or not
      if (postId) {
        // Check if Object id is valid or not
        if (isValidObjectId(postId)) {
          const postExist = await getPostDetails({ _id: postId });

          // Check if post exists or not
          if (postExist) {
            //get data from client
            const { content } = req.body;

            let updatedData: any = {};
            if (content && content !== "") {
              updatedData.content = content;
            }

            //update post using postId
            const data = await updatePost({ _id: postId }, updatedData);

            return next({
              statusCode: 200,
              success: true,
              data: data,
              message: "Post updated",
            });
          } else {
            return next({
              statusCode: 400,
              message: "Post doesn't exist",
            });
          }
        } else {
          return next({
            statusCode: 401,
            message: "Invalid mongo object id",
          });
        }
      } else {
        return next({
          statusCode: 401,
          message: "Post id not present",
        });
      }
    } catch (error) {
      return next({
        statusCode: 500,
        message: error.message,
      });
    }
  }
);

const deleteSpecificPost = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get post Id from params
      const postId = req.params.id;

      // Check postId exists or not
      if (postId) {
        // Check if Object id is valid or not
        if (isValidObjectId(postId)) {
          const postExist = await getPostDetails({ _id: postId });

          // Check if post exists or not
          if (postExist) {
            //update post using postId
            const data = await deletePost({ _id: postId });

            return next({
              statusCode: 200,
              success: true,
              data: data,
              message: "Post Deleted",
            });
          } else {
            return next({
              statusCode: 400,
              message: "Post doesn't exist",
            });
          }
        } else {
          return next({
            statusCode: 401,
            message: "Invalid mongo object Id",
          });
        }
      } else {
        return next({
          statusCode: 401,
          message: "Post id not present",
        });
      }
    } catch (error) {
      return next({
        statusCode: 500,
        message: error.message,
      });
    }
  }
);

export {
  getUserPosts,
  followingUsersPosts,
  createPost,
  schedulePost,
  updateSpecificPost,
  deleteSpecificPost,
};
