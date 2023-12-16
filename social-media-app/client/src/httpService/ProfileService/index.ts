import request from "../request"

const getDetails = (userId: string, token: string) => {
    request({
        url: `/api/v1/user/details/${userId}`,
        method: 'GET',
        headers: {
            "x-auth-token": token
        }
    })
}

const ProfileService = {
    getDetails
};

export default ProfileService