import request from "../request";

const getOwnPosts = (userId: string, token: string) => {
    return request({
        url: `/api/v1/post/${userId}`,
        method: "GET",
        headers: {
            "x-auth-token": token
        }
    });
};

const createPost = (userId: string, data: object, token: string) => {
    return request({
        url: `/api/v1/post/${userId}`,
        method: "POST",
        data: data,
        headers: {
            "x-auth-token": token
        }
    });
}

const PostService = {
    getOwnPosts,
    createPost
};

export default PostService;
