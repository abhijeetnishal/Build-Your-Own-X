"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpecificPost = exports.updateSpecificPost = exports.schedulePost = exports.createPost = exports.followingUsersPosts = exports.getUserPosts = void 0;
const async_1 = __importDefault(require("../middlewares/async"));
const postService_1 = require("../service/postService");
const mongoose_1 = __importStar(require("mongoose"));
const userService_1 = require("../service/userService");
const commonHelper_1 = require("../helper/commonHelper");
const redis_1 = __importDefault(require("../infra/redis"));
const cronjobScheduler_1 = require("../config/cronjobScheduler");
const getUserPosts = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get userId from req
        const userId = req.params.id;
        // Check if Object id is valid or not
        if ((0, mongoose_1.isValidObjectId)(userId)) {
            const userExist = yield (0, userService_1.getUserDetails)({ "author._id": userId });
            // Check if user registered or not
            if (userExist) {
                // Get client from redisConnect.ts file
                const client = yield (0, redis_1.default)();
                // Using caching for all posts
                // Check if value is present in cache or not
                const dataCached = yield client.get("user_posts_cache_" + userId);
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
                }
                else {
                    // Get user posts
                    const userPosts = yield (0, postService_1.getAllPosts)({ "author._id": userId });
                    if (userPosts.length) {
                        // Store the data in Redis(key, value) with options
                        yield client.set("user_posts_cache_" + userId, JSON.stringify(userPosts), {
                            //set expiration time
                            EX: 300,
                            //not exist
                            NX: true,
                        });
                    }
                    next({
                        success: true,
                        statusCode: 200,
                        data: userPosts,
                        message: "Users posts",
                    });
                }
            }
            else {
                return next({
                    statusCode: 400,
                    message: "User doesn't exist",
                });
            }
        }
        else {
            return next({
                statusCode: 401,
                message: "Invalid mongo object Id",
            });
        }
    }
    catch (error) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
}));
exports.getUserPosts = getUserPosts;
const followingUsersPosts = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user Id from req
        const userId = req.params.id;
        // Check user Id is present or not
        if (userId) {
            // Check Id's are valid or not
            if ((0, mongoose_1.isValidObjectId)(userId)) {
                // Check if user exists or not
                const userExist = yield (0, userService_1.getUserDetails)({ _id: userId });
                if (userExist) {
                    const posts = yield (0, postService_1.getAllFollowingUsersPosts)({
                        followeeId: new mongoose_1.default.Types.ObjectId(userId),
                    });
                    return next({
                        statusCode: 200,
                        success: true,
                        data: posts,
                        message: "Following users posts",
                    });
                }
                else {
                    return next({
                        statusCode: 401,
                        message: "User User doesn't exist",
                    });
                }
            }
            else {
                return next({
                    statusCode: 401,
                    message: "Invalid mongo object Id",
                });
            }
        }
        else {
            return next({
                statusCode: 400,
                message: "Require user Id",
            });
        }
    }
    catch (error) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
}));
exports.followingUsersPosts = followingUsersPosts;
const createPost = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get userId from req
        const userId = req.params.id;
        // Check if Object id is valid or not
        if ((0, mongoose_1.isValidObjectId)(userId)) {
            const userExist = yield (0, userService_1.getUserDetails)({ _id: userId });
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
                }
                else {
                    // Create post
                    const newPost = yield (0, postService_1.savePost)(postDetails);
                    // Get client from redisConnect.ts file
                    const client = yield (0, redis_1.default)();
                    // Invalidate cache
                    client.del("user_posts_cache_" + userId);
                    return next({
                        success: true,
                        statusCode: 200,
                        message: "Post created",
                        data: newPost,
                    });
                }
            }
            else {
                return next({
                    statusCode: 400,
                    message: "User doesn't exist",
                });
            }
        }
        else {
            return next({
                statusCode: 401,
                message: "Invalid mongo object Id",
            });
        }
    }
    catch (error) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
}));
exports.createPost = createPost;
const schedulePost = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get userId from req
        const userId = req.params.id;
        // Check if Object id is valid or not
        if ((0, mongoose_1.isValidObjectId)(userId)) {
            const userExist = yield (0, userService_1.getUserDetails)({ _id: userId });
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
                }
                else {
                    const scheduledPost = yield (0, postService_1.saveSchedulePost)(postDetails);
                    cronjobScheduler_1.task.start();
                    // await producePostToKafka(postDetails);
                    // const messages = await consumer.consume({
                    //   consumerGroupId: "group_1",
                    //   instanceId: "instance_1",
                    //   topics: ["schedule_post"],
                    //   autoOffsetReset: "earliest",
                    // });
                    return next({
                        statusCode: 200,
                        success: true,
                        data: scheduledPost,
                        message: "Post scheduled",
                    });
                }
            }
            else {
                return next({
                    statusCode: 400,
                    message: "User doesn't exist",
                });
            }
        }
        else {
            return next({
                statusCode: 401,
                message: "Invalid mongo object Id",
            });
        }
    }
    catch (error) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
}));
exports.schedulePost = schedulePost;
const updateSpecificPost = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get post Id from params
        const postId = req.params.id;
        // Check postId exists or not
        if (postId) {
            // Check if Object id is valid or not
            if ((0, mongoose_1.isValidObjectId)(postId)) {
                const postExist = yield (0, postService_1.getPostDetails)({ _id: postId });
                // Check if post exists or not
                if (postExist) {
                    // Get access token from request header
                    const token = req.header("x-auth-token");
                    const { userId } = (0, commonHelper_1.parseJwt)(token);
                    //get data from client
                    const { content } = req.body;
                    let updatedData = {};
                    if (content && content !== "") {
                        updatedData.content = content;
                    }
                    //update post using postId
                    const data = yield (0, postService_1.updatePost)({ _id: postId }, updatedData);
                    //get client from redisConnect.ts file
                    const client = yield (0, redis_1.default)();
                    //invalidate cache
                    client.del("user_posts_cache_" + userId);
                    return next({
                        statusCode: 200,
                        success: true,
                        data: data,
                        message: "Post updated",
                    });
                }
                else {
                    return next({
                        statusCode: 400,
                        message: "Post doesn't exist",
                    });
                }
            }
            else {
                return next({
                    statusCode: 401,
                    message: "Invalid mongo object id",
                });
            }
        }
        else {
            return next({
                statusCode: 401,
                message: "Post id not present",
            });
        }
    }
    catch (error) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
}));
exports.updateSpecificPost = updateSpecificPost;
const deleteSpecificPost = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get post Id from params
        const postId = req.params.id;
        // Check postId exists or not
        if (postId) {
            // Check if Object id is valid or not
            if ((0, mongoose_1.isValidObjectId)(postId)) {
                const postExist = yield (0, postService_1.getPostDetails)({ _id: postId });
                // Check if post exists or not
                if (postExist) {
                    // Get access token from request header
                    const token = req.header("x-auth-token");
                    const { userId } = (0, commonHelper_1.parseJwt)(token);
                    //update post using postId
                    const data = yield (0, postService_1.deletePost)({ _id: postId });
                    //get client from redisConnect.ts file
                    const client = yield (0, redis_1.default)();
                    //invalidate cache
                    client.del("user_posts_cache_" + userId);
                    return next({
                        statusCode: 200,
                        success: true,
                        data: data,
                        message: "Post Deleted",
                    });
                }
                else {
                    return next({
                        statusCode: 400,
                        message: "Post doesn't exist",
                    });
                }
            }
            else {
                return next({
                    statusCode: 401,
                    message: "Invalid mongo object Id",
                });
            }
        }
        else {
            return next({
                statusCode: 401,
                message: "Post id not present",
            });
        }
    }
    catch (error) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
}));
exports.deleteSpecificPost = deleteSpecificPost;
//# sourceMappingURL=postController.js.map