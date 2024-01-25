import request from "../request";

const getProfileDetails = (token: string)=>{
  return request({
    url: `/api/v1/user/details`,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
}

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

const unfollowUser = (userId: string, payload: Object, token: string) => {
  return request({
    url: `/api/v1/user/unfollow/${userId}`,
    method: "DELETE",
    body: payload,
    headers: {
      "x-auth-token": token,
    },
  });
};

const ProfileService = {
  getProfileDetails,
  getFollowers,
  getFollowings,
  unfollowUser,
};

export default ProfileService;
