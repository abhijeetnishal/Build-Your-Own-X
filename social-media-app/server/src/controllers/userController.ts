import userSchema from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import relationshipSchema from "../models/relationshipModel";
import postSchema from "../models/postModel";
import { parseJwt, validatePassword } from "../helper/commonHelper";
import asyncMiddleware from "../middlewares/async";
import {
  getUserDetails,
  getFollowerDetails,
  addFollowerDetails,
  removeFollowerDetails,
  getAllFollowers,
} from "../service/userService";
import mongoose, { isValidObjectId } from "mongoose";

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
    // Get access token from request header
    const token = req.header("x-auth-token");

    // Check token exists or not
    if (token) {
      const { userId } = parseJwt(token);

      if (userId) {
        // Check if Object id is valid or not
        if (isValidObjectId(userId)) {
          const userExist = await getUserDetails({ _id: userId });

          // Check if user registered or not
          if (userExist) {
            return res.status(200).json({
              userId: userExist._id,
              userName: userExist.userName,
            });
          } else {
            return res.status(400).json({ message: "User doesn't exist" });
          }
        } else {
          return res.status(400).json({ message: "Invalid mongo object id" });
        }
      } else {
        return res.status(401).json("Invalid token");
      }
    } else {
      return res.status(401).json({ message: "Token is not present" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
1. Get all followee Id's from relationship collection using follower Id(user Id)
2. Get all profile details of followee Id's using aggregation
3. Send all details to client
*/
const followerDetails = asyncMiddleware(
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
            const followers = await getAllFollowers("followerId", {
              followerId: new mongoose.Types.ObjectId(userId),
            });

            return next({
              statusCode: 200,
              success: true,
              data: followers,
              message: "All followers details",
            });
          } else {
            return next({
              statusCode: 401,
              message: "User doesn't exist",
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

const followingDetails = asyncMiddleware(
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
            const followings = await getAllFollowers("followeeId", {
              followeeId: new mongoose.Types.ObjectId(userId),
            });

            return next({
              statusCode: 200,
              success: true,
              data: followings,
              message: "All followings details",
            });
          } else {
            return next({
              statusCode: 401,
              message: "User doesn't exist",
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

const addFollower = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get follower and followee id from req
      const { followerId, followeeId } = req.body;

      // Check Id's are present or not
      if (followeeId && followerId) {
        // Check Id's are valid or not
        if (isValidObjectId(followeeId) && isValidObjectId(followerId)) {
          // Check if user is already following other user or not
          const isFollowing = await getFollowerDetails(followerId, followeeId);

          if (isFollowing) {
            return next({
              statusCode: 400,
              message: "User already following",
            });
          } else {
            // Add follower
            const follower = await addFollowerDetails(followerId, followeeId);

            return next({
              statusCode: 200,
              status: true,
              message: "User follower added",
              data: follower,
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
          message: "Require follower/followee Id's",
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

const deleteFollowerFollowing = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get follower and followee id from req
      const { followerId, followeeId } = req.body;

      // Check Id's are present or not
      if (followeeId && followerId) {
        // Check Id's are valid or not
        if (isValidObjectId(followeeId) && isValidObjectId(followerId)) {
          // Check if user is following other user or not
          const isFollowing = await getFollowerDetails(followerId, followeeId);

          if (!isFollowing) {
            return next({
              statusCode: 400,
              message: "User not following",
            });
          } else {
            // remove follower
            const follower = await removeFollowerDetails(
              followerId,
              followeeId
            );

            return next({
              statusCode: 200,
              status: true,
              message: "User follower removed",
              data: follower,
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
          message: "Require follower/followee Id's",
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

export {
  signup,
  login,
  profileDetails,
  followerDetails,
  followingDetails,
  addFollower,
  deleteFollowerFollowing,
  getAllFollowingUsersPosts,
};
