import request from "../request";

const getUserPosts = (userId: string, token: string) => {
  return request({
    url: `/api/v1/posts/${userId}`,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
};

const getFollowingUsersPosts = (userId: string, token: string) => {
  return request({
    url: `/api/v1/posts/following-users/${userId}`,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
};

const createPost = (userId: string, data: object, token: string) => {
  return request({
    url: `/api/v1/posts/${userId}`,
    method: "POST",
    data: data,
    headers: {
      "x-auth-token": token,
    },
  });
};

const schedulePost = (userId: string, data: object, token: string) => {
  return request({
    url: `/api/v1/posts/schedule/${userId}`,
    method: "POST",
    data: data,
    headers: {
      "x-auth-token": token,
    },
  });
};

const updatePost = (postId: string, payload: Object, token: string) => {
  return request({
    url: `/api/v1/posts/${postId}`,
    method: "PATCH",
    data: payload,
    headers: {
      "x-auth-token": token,
    },
  });
};

const deletePost = (postId: string, token: string) => {
  return request({
    url: `/api/v1/posts/${postId}`,
    method: "DELETE",
    headers: {
      "x-auth-token": token,
    },
  });
};

const PostService = {
  getUserPosts,
  getFollowingUsersPosts,
  createPost,
  schedulePost,
  updatePost,
  deletePost,
};

export default PostService;
