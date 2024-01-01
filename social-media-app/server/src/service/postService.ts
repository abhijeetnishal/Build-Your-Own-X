import { scheduledPostSchema } from "../models/scheduledPostModel";
import { producer } from "../infra/kafka";
import postSchema from "../models/postModel";
import { Post } from "post";
import relationshipSchema from "../models/relationshipModel";

const getPostDetails = (query: Object) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      // Get post details
      const post = await postSchema.findOne(query);

      if (post) {
        resolve(post);
      } else {
        reject("Something went wrong!");
      }
    }
  );
};

const getAllFollowingUsersPosts = (query: Object) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      const posts = await relationshipSchema.aggregate([
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
    }
  );
};

const getAllPosts = (query: object) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      const userPosts = await postSchema.find(query).sort({ updatedAt: -1 });

      if (userPosts) {
        resolve(userPosts);
      } else {
        reject("Something went wrong!");
      }
    }
  );
};

const savePost = (data: object) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      // Create a new post
      const newPost = new postSchema(data);
      const post = await newPost.save();

      if (post) {
        resolve(post);
      } else {
        reject("Something went wrong!");
      }
    }
  );
};

const saveSchedulePost = (data: object) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      // Create a new post
      const newPost = new scheduledPostSchema(data);
      const post = await newPost.save();

      if (post) {
        resolve(post);
      } else {
        reject("Something went wrong!");
      }
    }
  );
};

const producePostToKafka = async (post: Post) => {
  const message = { post: JSON.stringify(post) };
  await producer.produce("schedule_post", message);
};

const updatePost = (query: Object, updateData: Object) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      // Update a post
      const post = postSchema.updateOne(query, updateData);

      if (post) {
        resolve(post);
      } else {
        reject("Something went wrong!");
      }
    }
  );
};

const deletePost = (query: Object) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      // Update a post
      const post = postSchema.deleteOne(query);

      if (post) {
        resolve(post);
      } else {
        reject("Something went wrong!");
      }
    }
  );
};

export {
  getPostDetails,
  getAllPosts,
  getAllFollowingUsersPosts,
  savePost,
  saveSchedulePost,
  producePostToKafka,
  updatePost,
  deletePost,
};
