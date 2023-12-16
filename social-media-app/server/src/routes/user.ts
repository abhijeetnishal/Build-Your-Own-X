// Import express to use router method
import express from 'express';
import isAuthenticated from '../middlewares/auth';
import {
    signup,
    login,
    profileDetails,
    followerDetails,
    followingDetails,
    addFollowerFollowing,
    deleteFollowerFollowing,
    getAllFollowingUsersPosts,
    getAllUserPosts,
    createPost,
    updateSpecificPost,
    deleteSpecificPost
} from '../controllers/userController';

// express.Router() is a method in the Express.js that  Creates a new router object.
// It is used to define routes for a specific endpoint.
const userRouter = express.Router();

// Create an endpoint to register a user.
userRouter.post('/signup', signup);

// Create an endpoint to login a user.
userRouter.post('/login', login);

// isAuthenticated is a middleware to check user is authenticated or not
// Create an endpoint to get profile details.
userRouter.get('/details/:id', isAuthenticated, profileDetails)

// Create an endpoint to get follower list.
userRouter.get('/follower', isAuthenticated, followerDetails);

// Create an endpoint to get following list.
userRouter.get('/following', isAuthenticated, followingDetails);

// Create an endpoint to add follower.
userRouter.post('/add-follower', isAuthenticated, addFollowerFollowing);

// Create an endpoint to remove follower.
userRouter.delete('/remove-follower', isAuthenticated, deleteFollowerFollowing);

// Create an endpoint for getting all posts of user.
userRouter.get('/user-own-posts', isAuthenticated, getAllUserPosts);

// Create an endpoint for getting all following users posts.
userRouter.get('/following-users-posts', isAuthenticated, getAllFollowingUsersPosts);

// Create an endpoint for Creating a post.
userRouter.post('/posts', isAuthenticated, createPost);

// Create an endpoint for updating a post.
userRouter.put('/posts/:id', isAuthenticated, updateSpecificPost);

// Create an endpoint for deleting a post
userRouter.delete('/posts/:id', isAuthenticated, deleteSpecificPost);

// Export to router to use in other files (index.js file)
export default userRouter;