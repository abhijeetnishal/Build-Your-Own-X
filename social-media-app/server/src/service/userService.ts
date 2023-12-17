import userSchema from "../models/userModel";

const getUserDetails = (query: object) => {
    return new Promise(
        async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
            const user = userSchema.findOne(query);

            if (user) {
                resolve(user);
            } else {
                reject("Something went wrong!");
            }
        }
    );
};

export default getUserDetails;

