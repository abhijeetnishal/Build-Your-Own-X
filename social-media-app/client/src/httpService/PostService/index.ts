import request from "../request";

const getOwnPosts = (data: Object, token: string) => {
    return request({
        url: "/api/v1/user/login",
        method: "POST",
        data: data,
        headers: {
            "x-auth-token": token
        }
    });
};

const PostService = {
    getOwnPosts
};

export default PostService;
