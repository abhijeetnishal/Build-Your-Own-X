import request from "../request";

const getUserPosts = (userId: string, token: string) => {
  return request({
    url: `/api/v1/post/${userId}`,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
};

const getFollowingUsersPosts = (userId: string, token: string) => {
  return request({
    url: `/api/v1/post/following-users/${userId}`,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
};

const createPost = (userId: string, data: object, token: string) => {
  return request({
    url: `/api/v1/post/${userId}`,
    method: "POST",
    data: data,
    headers: {
      "x-auth-token": token,
    },
  });
};

const updatePost = (postId: string, payload: Object, token: string) => {
  return request({
    url: `/api/v1/post/${postId}`,
    method: "PATCH",
    data: payload,
    headers: {
      "x-auth-token": token,
    },
  });
};

const deletePost = (postId: string, token: string) => {
  return request({
    url: `/api/v1/post/${postId}`,
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
  updatePost,
  deletePost,
};

export default PostService;
