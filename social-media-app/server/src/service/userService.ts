import relationshipSchema from "../models/relationshipModel";
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

const getFollowerDetails = (followerId: string, followeeId: string) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      const follower = await relationshipSchema.findOne({
        followerId: followerId,
        followeeId: followeeId,
      });

      resolve(follower);
    }
  );
};

const addFollowerDetails = (followerId: string, followeeId: string) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      const follower = await new relationshipSchema({
        followerId: followerId,
        followeeId: followeeId,
      });

      await follower.save();

      if (follower) {
        resolve(follower);
      } else {
        reject("Something went wrong!");
      }
    }
  );
};

export { getUserDetails, getFollowerDetails, addFollowerDetails };
