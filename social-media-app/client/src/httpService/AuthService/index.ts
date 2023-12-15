import request from '../request'

const signUp = (data: Object) => {
    return request({
        url: '/api/v1/user/signup',
        method: 'POST',
        data: data,
        // headers: {
        //     "x-auth-token": token
        // }
    })
}

const AuthService = {
    signUp
}

export default AuthService;