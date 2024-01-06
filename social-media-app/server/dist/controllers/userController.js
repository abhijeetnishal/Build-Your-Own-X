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
exports.removeFollower = exports.addFollower = exports.followingDetails = exports.followerDetails = exports.profileDetails = exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const commonHelper_1 = require("../helper/commonHelper");
const async_1 = __importDefault(require("../middlewares/async"));
const userService_1 = require("../service/userService");
const mongoose_1 = __importStar(require("mongoose"));
/*
1. Take user data: {username, email, password, etc}
2. Now implement input validation.
3. Check user is already registered or not using email
4. If not registered then save data (with password encrypted) to DB.
5. Else return user already registered.
*/
const signup = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        else if (password !== confirmPassword) {
            // 400 - Bad request
            return next({
                statusCode: 400,
                message: "password and confirm password not matches",
            });
        }
        else {
            const userExist = yield (0, userService_1.getUserDetails)({ userName: userName });
            // Check if user already registered or not
            if (userExist) {
                //400 - Bad request
                return next({
                    statusCode: 400,
                    message: "username already registered",
                });
            }
            else {
                // If password is strong
                if ((0, commonHelper_1.validatePassword)(password)) {
                    // Hash the password
                    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                    // Create a new user in DB
                    const createUser = yield userModel_1.default.create({
                        userName: userName,
                        password: hashedPassword,
                    });
                    return next({
                        success: true,
                        statusCode: 200,
                        message: "user registered successfully",
                        data: createUser,
                    });
                }
                else {
                    // If password is not strong 400(Bad request)
                    return next({
                        statusCode: 400,
                        message: "password contains at least 1 uc, 1 lc, 1 digit and 1 sc",
                    });
                }
            }
        }
    }
    catch (error) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
}));
exports.signup = signup;
/*
1. Take user data:{email, password}
2. Now implement input validation
3. Check if email is present or not in DB.
4. If not present, return user doesn't exist.
5. If present, then check password is matched or not if matched logged in, else password doesn't match.
6. Create a token using jwt for authentication and authorization.
*/
const login = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        else {
            const userExist = yield (0, userService_1.getUserDetails)({ userName: userName });
            // Check if user registered or not
            if (!userExist) {
                return next({
                    statusCode: 401,
                    message: "User doesn't exist",
                });
            }
            else {
                // Compare the password saved in DB and entered by user.
                const matchPassword = yield bcryptjs_1.default.compare(password, userExist.password);
                // If password doesn't match
                if (!matchPassword) {
                    // 401 - unauthorized
                    return next({
                        statusCode: 401,
                        message: "incorrect password",
                    });
                }
                else {
                    // Get userId
                    const objectId = userExist._id;
                    const userId = objectId.toHexString();
                    // Generate access token
                    const accessToken = jsonwebtoken_1.default.sign({ userId: userId, userName: userName }, process.env.ACCESS_TOKEN_SECRET);
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
    }
    catch (error) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
}));
exports.login = login;
const profileDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get access token from request header
        const token = req.header("x-auth-token");
        // Check token exists or not
        if (token) {
            const { userId } = (0, commonHelper_1.parseJwt)(token);
            if (userId) {
                // Check if Object id is valid or not
                if ((0, mongoose_1.isValidObjectId)(userId)) {
                    const userExist = yield (0, userService_1.getUserDetails)({ _id: userId });
                    // Check if user registered or not
                    if (userExist) {
                        return res.status(200).json({
                            userId: userExist._id,
                            userName: userExist.userName,
                        });
                    }
                    else {
                        return res.status(400).json({ message: "User doesn't exist" });
                    }
                }
                else {
                    return res.status(400).json({ message: "Invalid mongo object id" });
                }
            }
            else {
                return res.status(401).json("Invalid token");
            }
        }
        else {
            return res.status(401).json({ message: "Token is not present" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.profileDetails = profileDetails;
/*
1. Get all followee Id's from relationship collection using follower Id(user Id)
2. Get all profile details of followee Id's using aggregation
3. Send all details to client
*/
const followerDetails = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    const followers = yield (0, userService_1.getAllFollowers)("followerId", {
                        followerId: new mongoose_1.default.Types.ObjectId(userId),
                    });
                    return next({
                        statusCode: 200,
                        success: true,
                        data: followers,
                        message: "All followers details",
                    });
                }
                else {
                    return next({
                        statusCode: 401,
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
exports.followerDetails = followerDetails;
const followingDetails = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    const followings = yield (0, userService_1.getAllFollowers)("followeeId", {
                        followeeId: new mongoose_1.default.Types.ObjectId(userId),
                    });
                    return next({
                        statusCode: 200,
                        success: true,
                        data: followings,
                        message: "All followings details",
                    });
                }
                else {
                    return next({
                        statusCode: 401,
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
exports.followingDetails = followingDetails;
const addFollower = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get follower and followee id from req
        const { followerId, followeeId } = req.body;
        // Check Id's are present or not
        if (followeeId && followerId) {
            // Check Id's are valid or not
            if ((0, mongoose_1.isValidObjectId)(followeeId) && (0, mongoose_1.isValidObjectId)(followerId)) {
                // Check if user is already following other user or not
                const isFollowing = yield (0, userService_1.getFollowerDetails)(followerId, followeeId);
                if (isFollowing) {
                    return next({
                        statusCode: 400,
                        message: "User already following",
                    });
                }
                else {
                    // Add follower
                    const follower = yield (0, userService_1.addFollowerDetails)(followerId, followeeId);
                    return next({
                        statusCode: 200,
                        status: true,
                        message: "User follower added",
                        data: follower,
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
                message: "Require follower/followee Id's",
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
exports.addFollower = addFollower;
const removeFollower = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get follower and followee id from req
        const { followerId, followeeId } = req.body;
        // Check Id's are present or not
        if (followeeId && followerId) {
            // Check Id's are valid or not
            if ((0, mongoose_1.isValidObjectId)(followeeId) && (0, mongoose_1.isValidObjectId)(followerId)) {
                // Check if user is following other user or not
                const isFollowing = yield (0, userService_1.getFollowerDetails)(followerId, followeeId);
                if (!isFollowing) {
                    return next({
                        statusCode: 400,
                        message: "User not following",
                    });
                }
                else {
                    // remove follower
                    const follower = yield (0, userService_1.removeFollowerDetails)(followerId, followeeId);
                    return next({
                        statusCode: 200,
                        status: true,
                        message: "User follower removed",
                        data: follower,
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
                message: "Require follower/followee Id's",
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
exports.removeFollower = removeFollower;
//# sourceMappingURL=userController.js.map