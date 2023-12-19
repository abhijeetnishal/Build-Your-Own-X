import userSchema from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import relationshipSchema from "../models/relationshipModel";
import redisConnect from "../config/redisConnect";
import postSchema from "../models/postModel";
import { parseJwt, validatePassword } from "../helper/commonHelper";
import asyncMiddleware from "../middlewares/async";
import getUserDetails from "../service/userService";
import { savePost, getAllPosts } from "../service/postService";
import { isValidObjectId } from "mongoose";

/*
1. Take user data: {username, email, password, etc}
2. Now implement input validation.
3. Check user is already registered or not using email
4. If not registered then save data (with password encrypted) to DB.
5. Else return user already registered.
*/
const signup = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    // Taking user data from client
    const { userName, password, confirmPassword } = req.body;

    // Using try catch for error handling
    try {
      if (!userName || !password || !confirmPassword) {
        // Bad request (400)
        return next({
          statusCode: 400,
          message: "enter required details",
        });
      } else if (password !== confirmPassword) {
        // 400 - Bad request
        return next({
          statusCode: 400,
          message: "password and confirm password not matches",
        });
      } else {
        const userExist = await getUserDetails({ userName: userName });

        // Check if user already registered or not
        if (userExist) {
          //400 - Bad request
          return next({
            statusCode: 400,
            message: "username already registered",
          });
        } else {
          // If password is strong
          if (validatePassword(password)) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user in DB
            const createUser = await userSchema.create({
              userName: userName,
              password: hashedPassword,
            });

            return next({
              success: true,
              statusCode: 200,
              message: "user registered successfully",
              data: createUser,
            });
          } else {
            // If password is not strong 400(Bad request)
            return next({
              statusCode: 400,
              message:
                "password contains at least 1 uc, 1 lc, 1 digit and 1 sc",
            });
          }
        }
      }
    } catch (error) {
      return next({
        statusCode: 500,
        message: error.message,
      });
    }
  }
);

/*
1. Take user data:{email, password}
2. Now implement input validation
3. Check if email is present or not in DB.
4. If not present, return user doesn't exist.
5. If present, then check password is matched or not if matched logged in, else password doesn't match.
6. Create a token using jwt for authentication and authorization.
*/
const login = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Taking user data from client
      const { userName, password } = req.body;

      // Validate input
      if (!userName || !password) {
        // Bad request (400)
        return next({
          statusCode: 400,
          message: "enter required details",
        });
      } else {
        const userExist = await getUserDetails({ userName: userName });

        // Check if user registered or not
        if (!userExist) {
          return next({
            statusCode: 401,
            message: "User doesn't exist",
          });
        } else {
          // Compare the password saved in DB and entered by user.
          const matchPassword: boolean = await bcrypt.compare(
            password,
            userExist.password
          );

          // If password doesn't match
          if (!matchPassword) {
            // 401 - unauthorized
            return next({
              statusCode: 401,
              message: "incorrect password",
            });
          } else {
            // Get userId
            const objectId = userExist._id;
            const userId = objectId.toHexString();

            // Generate access token
            const accessToken = jwt.sign(
              { userId: userId, userName: userName },
              process.env.ACCESS_TOKEN_SECRET as string
            );

            return next({
              success: true,
              statusCode: 200,
              message: "user logged-in",
              data: {
                userName: userName,
                userId: userId,
                authToken: accessToken,
              },
            });
          }
        }
      }
    } catch (error) {
      return next({
        statusCode: 500,
        message: error.message,
      });
    }
  }
);

const profileDetails = async (req: Request, res: Response) => {
  try {
    // Get token from req
    const { token } = req.body;

    // Check token exists or not
    if (token) {
        return res.status(200).json('user exists');
    } else {
      return res.status(401).json({ message: "Token is not present" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const followerDetails = async (req: Request, res: Response) => {
  try {
    // Get user Id from req
    const userId = req.params.id;

    // Get followers list
    const followersList = await relationshipSchema.find({ followerId: userId });

    // Get followers Id
    let followersId: Object[] = [];
    followersList.map((follower) => {
      followersId.push(follower.followingId);
    });

    const followersDetails: Object[] = [];

    // Get usernames from followers id
    for (const id of followersId) {
      const userDetails = await userSchema.findOne({ _id: id });
      followersDetails.push({ userDetails, userId });
    }

    return res
      .status(201)
      .json({ message: "follower list: ", data: followersDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error: " + error });
  }
};

const followingDetails = async (req: Request, res: Response) => {
  try {
    //get user Id from cookies
    const userId = req.cookies.user_cookies.userId;

    //get followers list
    const followingList = await relationshipSchema.find({
      followingId: userId,
    });

    //get followers Id
    let followingId: Object[] = [];
    followingList.map((following) => {
      followingId.push(following.followerId);
    });

    const followingDetails: Object[] = [];

    //get usernames from followers id
    for (const userId of followingId) {
      const userName = await userSchema.findOne({ _id: userId });
      if (userName._id !== userId) followingDetails.push(userName);
    }

    return res
      .status(201)
      .json({ message: "following list: ", data: followingDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error: " + error });
  }
};

const addFollowerFollowing = async (req: Request, res: Response) => {
  try {
    //get user follower and following Id
    const { followerId, followingId } = req.body;

    //check user following other user or not
    const isFollowing = await relationshipSchema.findOne({
      followingId: followingId,
      followerId: followerId,
    });

    if (isFollowing) {
      return res.status(400).json({ message: "already following" });
    } else {
      //insert data into DB
      const followerFollowingData = new relationshipSchema({
        followerId: followerId,
        followingId: followingId,
      });

      await followerFollowingData.save();

      return res.status(201).json({
        message: "follower following data added",
        data: followerFollowingData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error: " + error });
  }
};

const deleteFollowerFollowing = async (req: Request, res: Response) => {
  try {
    //get user follower and following Id
    const { followerId, followingId } = req.body;

    //get follower and following details
    const followerFollowingData = await relationshipSchema.findOne({
      followerId: followerId,
      followingId: followingId,
    });

    //extract _id
    const followerFollowingId = followerFollowingData._id;

    //delete
    await relationshipSchema.findByIdAndRemove(followerFollowingId);

    return res.status(200).json({ message: "data deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error: " + error });
  }
};

const getAllFollowingUsersPosts = async (req: Request, res: Response) => {
  try {
    //get userId from cookies
    const userId = req.cookies.user_cookies.userId;

    //get following users data
    const followingUsersList = await relationshipSchema.find({
      followerId: userId,
    });

    //get following users Id from data
    let followingUserIdList: object[] = [];
    followingUsersList.map((following) => {
      followingUserIdList.push(following.followingId);
    });

    //get following users posts
    let followingUsersPosts;
    for (const userId of followingUserIdList) {
      followingUsersPosts = await postSchema
        .find({ userId: userId })
        .sort({ updatedAt: -1 }) // Sort by createdAt in descending order
        .populate("userId", "userName"); // Populate user data with username
    }

    return res.status(200).json({
      message: "all following users posts: ",
      data: followingUsersPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error: " + error });
  }
};

const getUserPosts = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get userId from req
      const userId = req.params.id;

      // Check if Object id is valid or not
      if (isValidObjectId(userId)) {
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
        // Get data from req
        const { content } = req.body;

        // Check content is present or not
        if (!content) {
          // Bad request (400)
          return next({
            statusCode: 400,
            message: "enter content data",
          });
        } else {
          // Create post
          const newPost = await savePost({
            postContent: content,
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

const updateSpecificPost = async (req: Request, res: Response) => {
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

    return res
      .status(200)
      .json({ message: "post updated", data: updatedDocument });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" + error });
  }
};

const deleteSpecificPost = async (req: Request, res: Response) => {
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

    return res.status(200).json({ message: "post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error\n" + error });
  }
};

export {
  signup,
  login,
  profileDetails,
  followerDetails,
  followingDetails,
  addFollowerFollowing,
  deleteFollowerFollowing,
  getAllFollowingUsersPosts,
  getUserPosts,
  createPost,
  updateSpecificPost,
  deleteSpecificPost,
};
