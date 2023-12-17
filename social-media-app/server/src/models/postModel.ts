import mongoose from "mongoose";

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
    // Foreign key
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true })

// This will create a table or collection if there is no table with that name already.
const postSchema = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default postSchema;