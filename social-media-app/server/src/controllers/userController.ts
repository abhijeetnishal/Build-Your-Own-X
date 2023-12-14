import userSchema from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import relationshipSchema from "../models/relationshipModel";
import redisConnect from "../config/redisConnect";
import postSchema from "../models/postModel";
import { validatePassword } from "../helper/commonHelper";
import asyncMiddleware from "../middlewares/async";

/*
1. Take user data: {username, email, password, etc}
2. Now implement input validation.
3. Check user is already registered or not using email
4. If not registered then save data (with password encrypted) to DB.
5. Else return user already registered.
*/
const signup = asyncMiddleware(
    async (req: Request, res: Response, next: NextFunction) => {
        //taking user data from client
        const { userName, password, confirmPassword } = req.body;

        //using try catch for error handling
        try {
            if (!userName || !password || !confirmPassword) {
                //Bad request (400)
                return next({
                    statusCode: 400,
                    message: "enter required details",
                });
            } else if (password !== confirmPassword) {
                //400 - Bad request
                return next({
                    statusCode: 400,
                    success: false,
                    message: "password and confirm password not matches",
                });
            } else {
                const userExist = await userSchema.findOne({ userName: userName });

                //check if user already registered or not
                if (userExist) {
                    //400 - Bad request
                    return next({
                        statusCode: 400,
                        success: false,
                        message: "username already registered",
                    });
                } else {
                    //if password is strong
                    if (validatePassword(password)) {
                        //hash the password
                        const hashedPassword = await bcrypt.hash(password, 10);

                        //create a new user in DB
                        const createUser = await userSchema.create({
                            userName: userName,
                            password: hashedPassword,
                        });

                        return next({
                            statusCode: 200,
                            success: true,
                            message: "user registered successfully",
                            data: createUser,
                        });
                    } else {
                        //if password is not strong 400(Bad request)
                        return next({
                            statusCode: 400,
                            success: false,
                            message:
                                "password contains at least 1 uc, 1 lc, 1 digit and 1 sc",
                        });
                    }
                }
            }
        } catch (error) {
            return next({
                success: false,
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
const login = asyncMiddleware(async (req: Request, res: Response) => {
    try {
        //taking user data from client
        const { userName, password } = req.body;

        //validate input
        if (!userName || !password) {
            //Bad request (400)
            return res.status(400).json({ message: "enter required input fields" });
        } else {
            const userExist = await userSchema.findOne({ userName: userName });

            //check if user registered or not
            if (!userExist) {
                return res.status(400).json({ message: "user not registered" });
            } else {
                //compare the password saved in DB and entered by user.
                const matchPassword: boolean = await bcrypt.compare(
                    password,
                    userExist.password
                );

                //if password doesn't match
                if (!matchPassword) {
                    //401 - unauthorized
                    return res.status(401).json({ message: "incorrect password" });
                } else {
                    //get userId
                    const objectId = userExist._id;
                    const userId = objectId.toHexString();

                    //generate access token
                    const accessToken = jwt.sign(
                        { userId },
                        process.env.ACCESS_TOKEN_SECRET as string
                    );

                    //create cookie
                    return res
                        .cookie(
                            "user_cookies",
                            { accessToken, userId },
                            { sameSite: "none", secure: true }
                        )
                        .json("user logged in");
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("internal server error: " + error);
    }
});

//clear the cookie to logout
const logout = (req: Request, res: Response) => {
    return res.clearCookie("user_cookies").json("user logged out");
};

//(follower/following) controller
const profileDetails = async (req: Request, res: Response) => {
    try {
        //get user Id from cookies
        const userId = req.cookies.user_cookies.userId;

        //get profile data
        const profileData = await userSchema.findOne({ _id: userId });

        return res
            .status(201)
            .json({ message: "follower list: ", data: profileData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error: " + error });
    }
};

const followerDetails = async (req: Request, res: Response) => {
    try {
        //get user Id from cookies
        const userId = req.cookies.user_cookies.userId;

        //get followers list
        const followersList = await relationshipSchema.find({ followerId: userId });

        //get followers Id
        let followersId: Object[] = [];
        followersList.map((follower) => {
            followersId.push(follower.followingId);
        });

        const followersDetails: Object[] = [];

        //get usernames from followers id
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

const getAllUserPosts = async (req: Request, res: Response) => {
    try {
        //get userId from cookies
        const userId = req.cookies.user_cookies.userId;

        //get client from redisConnect.ts file
        const client = await redisConnect();

        //using caching for all posts
        //check if value is present in Redis or not
        const dataCached = await client.get("user_posts_cache_" + userId);

        //if value is present(cache hit)
        if (dataCached) {
            //parse the value from string to (arr of obj)
            const cachedData = JSON.parse(dataCached);

            //return the cached data instead from DB
            return res.status(200).json(cachedData);
        } else {
            //get following user data
            const userPosts = await postSchema
                .find({ userId: userId })
                .sort({ updatedAt: -1 });

            //store the data in Redis(key, value) with options
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

            res.status(200).json({ message: "all users posts: ", data: userPosts });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error: " + error });
    }
};

const createPost = async (req: Request, res: Response) => {
    try {
        //get data from client
        const { content, image, video } = req.body;

        //get userId from cookies
        const userId = req.cookies.user_cookies.userId;

        if (!content) {
            //Bad request (400)
            res.status(400).json("enter all required data");
        } else {
            //update post using postId
            const newPost = new postSchema({
                postContent: content,
                postImage: image,
                postVideo: video,
                userId: userId,
            });
            await newPost.save();

            //get client from redisConnect.ts file
            const client = await redisConnect();

            //invalidate cache
            client.del("user_posts_cache_" + userId);

            res.status(201).json({ message: "post created", data: newPost });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error\n" + error });
    }
};

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
    logout,
    profileDetails,
    followerDetails,
    followingDetails,
    addFollowerFollowing,
    deleteFollowerFollowing,
    getAllFollowingUsersPosts,
    getAllUserPosts,
    createPost,
    updateSpecificPost,
    deleteSpecificPost,
};
