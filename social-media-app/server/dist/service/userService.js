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
exports.getAllFollowers = exports.removeFollowerDetails = exports.addFollowerDetails = exports.getFollowerDetails = exports.getUserDetails = void 0;
const relationshipModel_1 = __importDefault(require("../models/relationshipModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getUserDetails = (query) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const user = userModel_1.default.findOne(query);
        if (user) {
            resolve(user);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.getUserDetails = getUserDetails;
const getFollowerDetails = (followerId, followeeId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const follower = yield relationshipModel_1.default.findOne({
            followerId: followerId,
            followeeId: followeeId,
        });
        resolve(follower);
    }));
};
exports.getFollowerDetails = getFollowerDetails;
const addFollowerDetails = (followerId, followeeId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const follower = yield new relationshipModel_1.default({
            followerId: followerId,
            followeeId: followeeId,
        });
        yield follower.save();
        if (follower) {
            resolve(follower);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.addFollowerDetails = addFollowerDetails;
const removeFollowerDetails = (followerId, followeeId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const follower = yield relationshipModel_1.default.findByIdAndRemove({
            followerId: followerId,
            followeeId: followeeId,
        });
        if (follower) {
            resolve(follower);
        }
        else {
            reject("Something went wrong!");
        }
    }));
};
exports.removeFollowerDetails = removeFollowerDetails;
const getAllFollowers = (userIdType, query) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const followerDetails = yield relationshipModel_1.default.aggregate([
            {
                // Filter documents a/c query
                $match: query,
            },
            {
                // Show only selected fields
                $project: {
                    _id: 0,
                    followeeId: 1,
                    followerId: 1,
                },
            },
            {
                // Show user details of users using followeeId (as userId) in users collection
                // and store details inside followerDetails list
                $lookup: {
                    from: "users",
                    localField: userIdType === "followerId" ? "followeeId" : "followerId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                // deconstruct an array, creating a separate document for each element in the array.
                $unwind: "$userDetails",
            },
            {
                // Show only required fields
                $project: {
                    _id: "$userDetails._id",
                    userName: "$userDetails.userName",
                    // Add other profile fields you want to retrieve
                },
            },
        ]);
        resolve(followerDetails);
    }));
};
exports.getAllFollowers = getAllFollowers;
//# sourceMappingURL=userService.js.map