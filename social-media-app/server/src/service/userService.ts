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

const removeFollowerDetails = (followerId: string, followeeId: string) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      const follower = await relationshipSchema.findByIdAndRemove({
        followerId: followerId,
        followeeId: followeeId,
      });

      if (follower) {
        resolve(follower);
      } else {
        reject("Something went wrong!");
      }
    }
  );
};

const getAllFollowers = (userIdType: string, query: Object) => {
  return new Promise(
    async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      const followerDetails = await relationshipSchema.aggregate([
        {
          // Filter documents a/c query
          $match: query,
        },
        {
          // Show only selected fields
          $project: {
            _id: 0,
            followeeId: 1,
            followerId: 1,
          },
        },
        {
          // Show user details of users using followeeId (as userId) in users collection
          // and store details inside followerDetails list
          $lookup: {
            from: "users",
            localField: userIdType,
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          // deconstruct an array, creating a separate document for each element in the array.
          $unwind: "$userDetails",
        },
        {
          // Show only required fields
          $project: {
            _id: "$userDetails._id",
            userName: "$userDetails.userName",
            // Add other profile fields you want to retrieve
          },
        },
      ]);
      //const followeeIds = await relationshipSchema.find(query).select(["followeeId"]);

      resolve(followerDetails);
    }
  );
};

export {
  getUserDetails,
  getFollowerDetails,
  addFollowerDetails,
  removeFollowerDetails,
  getAllFollowers,
};
