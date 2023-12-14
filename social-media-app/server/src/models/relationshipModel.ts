import mongoose from "mongoose";

//create a follower-following relationship schema
const RelationshipSchema = new mongoose.Schema({
    //references the follower user's _id from User collection
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    //references the following user's _id from User collection
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, { timestamps: true });

//this will create a table or collection if there is no table with that name already.
const relationshipSchema = mongoose.models.Followers || mongoose.model("Followers", RelationshipSchema);

export default relationshipSchema;