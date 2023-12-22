import mongoose, { Mongoose } from "mongoose";

// Create a postSchema
const PostSchema = new mongoose.Schema({
    // Specify how the fields should work by adding some mongoose option:
    postContent: {
        type: String,
        default: ''
    },
    postImage: {
        type: String,
        default: ''
    },
    postVideo: {
        type: String,
        default: ''
    },
    author: {
        type: Object,
        required: true,
    }
}, { timestamps: true })

// This will create a table or collection if there is no table with that name already.
const postSchema = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default postSchema;