import mongoose from "mongoose";

//create a postSchema
const PostSchema = new mongoose.Schema({
    //Specify how the fields should work by adding some mongoose option:
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
    //foreign key
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true })

//this will create a table or collection if there is no table with that name already.
const postSchema = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default postSchema;