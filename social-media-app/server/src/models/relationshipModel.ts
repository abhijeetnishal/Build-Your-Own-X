import mongoose from "mongoose";

// Create a follower-following relationship schema
const RelationshipSchema = new mongoose.Schema(
  {
    // References the follower user's _id from User collection
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // References the following user's _id from User collection
    followeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// This will create a table or collection if there is no table with that name already.
const relationshipSchema =
  mongoose.models.Followers || mongoose.model("Followers", RelationshipSchema);

export default relationshipSchema;
