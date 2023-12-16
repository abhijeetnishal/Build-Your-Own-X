import userSchema from "../models/userModel";

const getUserDetails = (userName: string) => {
    return new Promise(
        async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
            const user = userSchema.findOne({ userName: userName });

            if (user) {
                resolve(user);
            } else {
                reject("No user details found");
            }
        }
    );
};

export default getUserDetails;
