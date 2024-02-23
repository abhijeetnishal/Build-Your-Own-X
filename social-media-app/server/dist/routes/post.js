"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import express to use router method
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const postController_1 = require("../controllers/postController");
// express.Router() is a method in the Express.js that  Creates a new router object.
// It is used to define routes for a specific endpoint.
const postRouter = express_1.default.Router();
// isAuthenticated is a middleware to check user is authenticated or not
// Create an endpoint for getting all posts of user.
postRouter.get("/:id", auth_1.default, postController_1.getUserPosts);
// Create an endpoint for getting all following users posts.
postRouter.get("/following-users/:id", auth_1.default, postController_1.followingUsersPosts);
// Create an endpoint for Creating a post.
postRouter.post("/:id", auth_1.default, postController_1.createPost);
// Create an endpoint for schedule posts
postRouter.post("/schedule/:id", auth_1.default, postController_1.schedulePost);
// Create an endpoint for updating a post.
postRouter.patch("/:id", auth_1.default, postController_1.updateSpecificPost);
// Create an endpoint for deleting a post
postRouter.delete("/:id", auth_1.default, postController_1.deleteSpecificPost);
exports.default = postRouter;
//# sourceMappingURL=post.js.map