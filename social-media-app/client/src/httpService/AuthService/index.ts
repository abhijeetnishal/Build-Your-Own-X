import request from "../request";

const signUp = (data: Object) => {
  return request({
    url: "/api/v1/users/signup",
    method: "POST",
    data: data,
  });
};

const login = (data: Object) => {
  return request({
    url: "/api/v1/users/login",
    method: "POST",
    data: data,
  });
};

const AuthService = {
  signUp,
  login,
};

export default AuthService;
