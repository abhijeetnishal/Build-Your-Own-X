import request from "../request";

const getFollowers = (userId: string, token: string) => {
  return request({
    url: `/api/v1/user/follower/${userId}`,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
};

const getFollowings = (userId: string, token: string) => {
  return request({
    url: `/api/v1/user/following/${userId}`,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
};

const ProfileService = {
  getFollowers,
  getFollowings,
};

export default ProfileService;
