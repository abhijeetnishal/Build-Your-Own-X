import asyncMiddleware from "../middlewares/async";
import { NextFunction, Request, Response } from "express";
import {
  savePost,
  getAllPosts,
  getPostDetails,
  updatePost,
  deletePost,
  producePostToKafka,
} from "../service/postService";
import { isValidObjectId } from "mongoose";
import { getUserDetails } from "../service/userService";
import { parseJwt } from "../helper/commonHelper";
import redisConnect from "../infra/redis";
import { startWorker } from "../infra/kafka";

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
          // Get client from redisConnect.ts file
          const client = await redisConnect();

          // Using caching for all posts
          // Check if value is present in cache or not
          const dataCached = await client.get("user_posts_cache_" + userId);

          // If value is present(cache hit)
          if (dataCached) {
            // Parse the value from string to (arr of obj)
            const cachedData = JSON.parse(dataCached);

            // Return the cached data instead from DB
            return next({
              success: true,
              statusCode: 200,
              data: cachedData,
              message: "User posts",
            });
          } else {
            // Get user posts
            const userPosts = await getAllPosts({ "author._id": userId });

            if (userPosts.length) {
              // Store the data in Redis(key, value) with options
              await client.set(
                "user_posts_cache_" + userId,
                JSON.stringify(userPosts),
                {
                  //set expiration time
                  EX: 300,
                  //not exist
                  NX: true,
                }
              );
            }
            next({
              success: true,
              statusCode: 200,
              data: userPosts,
              message: "Users posts",
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
          message: "Invalid mongo object id",
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

            // Get client from redisConnect.ts file
            const client = await redisConnect();

            // Invalidate cache
            client.del("user_posts_cache_" + userId);

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
          message: "Invalid mongo object id",
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
            //const scheduledPost = await saveSchedulePost(postDetails);
            await producePostToKafka(postDetails);
            startWorker();

            return next({
              statusCode: 200,
              success: true,
              data: postDetails,
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
          message: "Invalid mongo object id",
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
            // Get access token from request header
            const token = req.header("x-auth-token");
            const { userId } = parseJwt(token);

            //get data from client
            const { content } = req.body;

            let updatedData: any = {};
            if (content && content !== "") {
              updatedData.content = content;
            }

            //update post using postId
            const data = await updatePost({ _id: postId }, updatedData);

            //get client from redisConnect.ts file
            const client = await redisConnect();

            //invalidate cache
            client.del("user_posts_cache_" + userId);

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
            // Get access token from request header
            const token = req.header("x-auth-token");
            const { userId } = parseJwt(token);

            //update post using postId
            const data = await deletePost({ _id: postId });

            //get client from redisConnect.ts file
            const client = await redisConnect();

            //invalidate cache
            client.del("user_posts_cache_" + userId);

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

export {
  getUserPosts,
  createPost,
  schedulePost,
  updateSpecificPost,
  deleteSpecificPost,
};
