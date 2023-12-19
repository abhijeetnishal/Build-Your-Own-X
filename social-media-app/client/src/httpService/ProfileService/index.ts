import request from "../request";

const getDetails = (token: string) => {
  request({
    url: `/api/v1/user/details`,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
};

const ProfileService = {
  getDetails,
};

export default ProfileService;
