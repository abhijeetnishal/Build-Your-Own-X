import asyncMiddleware from "../middlewares/async";
import { NextFunction, Request, Response } from "express";
import redisConnect from "../config/redisConnect";
import { savePost, getAllPosts } from "../service/postService";
import { isValidObjectId } from "mongoose";
import getUserDetails from "../service/userService";
import postSchema from "../models/postModel";

const getUserPosts = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get userId from req
      const userId = req.params.id;

      // Check if Object id is valid or not
      if (isValidObjectId(userId)) {
        const userExist = await getUserDetails({ _id: userId });

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
            const userPosts = await getAllPosts({ userId: userId });

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
          const { post } = req.body;

          // Check content is present or not
          if (!post) {
            // Bad request (400)
            return next({
              statusCode: 400,
              message: "enter content data",
            });
          } else {
            // Create post
            const newPost = await savePost({
              postContent: post,
              userId: userId,
            });

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

const updateSpecificPost = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get post Id from params
      const postId = req.params.id;

      //get userId from cookies
      const userId = req.cookies.user_cookies.userId;

      //get data from client
      const { content, image, video } = req.body;

      //update post using postId
      const updatedPost = {
        postContent: content,
        postImage: image,
        postVideo: video,
        userId: userId,
      };
      const updatedDocument = await postSchema.findByIdAndUpdate(
        postId,
        updatedPost,
        { new: true }
      );

      //get client from redisConnect.ts file
      const client = await redisConnect();

      //invalidate cache
      client.del("user_posts_cache_" + userId);

      // return res
      //   .status(200)
      //   .json({ message: "post updated", data: updatedDocument });
    } catch (error) {
      //res.status(500).json({ message: "internal server error" + error });
    }
  }
);

const deleteSpecificPost = asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  try {
    //get post Id from params
    const postId = req.params.id;

    //get userId from cookies
    const userId = req.cookies.user_cookies.userId;

    //delete post using postId
    await postSchema.findByIdAndRemove(postId);

    //get client from redisConnect.ts file
    const client = await redisConnect();

    //invalidate cache
    client.del("user_posts_cache_" + userId);

    //return res.status(200).json({ message: "post deleted" });
  } catch (error) {
    //res.status(500).json({ message: "internal server error\n" + error });
  }
});

export { getUserPosts, createPost, updateSpecificPost, deleteSpecificPost };
