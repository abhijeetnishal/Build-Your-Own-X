"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import express to use router method
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const userController_1 = require("../controllers/userController");
// express.Router() is a method in the Express.js that  Creates a new router object.
// It is used to define routes for a specific endpoint.
const userRouter = express_1.default.Router();
// Create an endpoint to register a user.
userRouter.post("/signup", userController_1.signup);
// Create an endpoint to login a user.
userRouter.post("/login", userController_1.login);
// isAuthenticated is a middleware to check user is authenticated or not
// Create an endpoint to get profile details.
userRouter.get("/details", auth_1.default, userController_1.profileDetails);
// Create an endpoint to get followers list.
userRouter.get("/follower/:id", auth_1.default, userController_1.followerDetails);
// Create an endpoint to get following list.
userRouter.get("/following/:id", auth_1.default, userController_1.followingDetails);
// Create an endpoint to add follower.
userRouter.post("/follow", auth_1.default, userController_1.addFollower);
// Create an endpoint to remove follower.
userRouter.delete("/unfollow", auth_1.default, userController_1.removeFollower);
// Export to router to use in other files (index.js file)
exports.default = userRouter;
//# sourceMappingURL=user.js.map