"use strict";
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
exports.deletePost = exports.updatePost = exports.saveSchedulePost = exports.savePost = exports.getAllFollowingUsersPosts = exports.getAllPosts = exports.getPostDetails = void 0;
const scheduledPostModel_1 = require("../models/scheduledPostModel");
const postModel_1 = __importDefault(require("../models/postModel"));
const relationshipModel_1 = __importDefault(require("../models/relationshipModel"));
const getPostDetails = (query) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // Get post details
        const post = yield postModel_1.default.findOne(query);
        if (post) {
            resolve(post);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.getPostDetails = getPostDetails;
const getAllFollowingUsersPosts = (query) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield relationshipModel_1.default.aggregate([
            {
                $match: query,
            },
            {
                $project: {
                    _id: 0,
                    followerId: 1,
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "followerId",
                    foreignField: "author._id",
                    as: "posts",
                },
            },
            {
                $unwind: "$posts",
            },
            {
                $project: {
                    content: "$posts.content",
                    author: {
                        _id: "$posts.author._id",
                        name: "$posts.author.name",
                    },
                    updatedAt: "$posts.updatedAt",
                },
            },
            {
                $sort: {
                    updatedAt: -1,
                },
            },
            // {
            //   $limit: 10
            // }
        ]);
        resolve(posts);
    }));
};
exports.getAllFollowingUsersPosts = getAllFollowingUsersPosts;
const getAllPosts = (query) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const userPosts = yield postModel_1.default.find(query).sort({ updatedAt: -1 });
        if (userPosts) {
            resolve(userPosts);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.getAllPosts = getAllPosts;
const savePost = (data) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new post
        const newPost = new postModel_1.default(data);
        const post = yield newPost.save();
        if (post) {
            resolve(post);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.savePost = savePost;
const saveSchedulePost = (data) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new post
        const newPost = new scheduledPostModel_1.scheduledPostSchema(data);
        const post = yield newPost.save();
        if (post) {
            resolve(post);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.saveSchedulePost = saveSchedulePost;
const updatePost = (query, updateData) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // Update a post
        const post = postModel_1.default.updateOne(query, updateData);
        if (post) {
            resolve(post);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.updatePost = updatePost;
const deletePost = (query) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // Update a post
        const post = postModel_1.default.deleteOne(query);
        if (post) {
            resolve(post);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.deletePost = deletePost;
//# sourceMappingURL=postService.js.map