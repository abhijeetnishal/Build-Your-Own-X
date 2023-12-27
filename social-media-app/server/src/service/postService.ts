import { scheduledPostSchema } from "../models/scheduledPostModel";
import { producer } from "../infra/kafka";
import postSchema from "../models/postModel";
import { Post } from "post";

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
  await producer.connect();

  await producer.send({
    topic: "scheduled-posts",
    messages: [{ value: JSON.stringify(post) }],
  });

  await producer.disconnect();
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
  savePost,
  saveSchedulePost,
  producePostToKafka,
  updatePost,
  deletePost,
};
