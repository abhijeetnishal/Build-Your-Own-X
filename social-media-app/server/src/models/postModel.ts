import mongoose from "mongoose";

// Create a postSchema
const PostSchema = new mongoose.Schema(
  {
    // Specify how the fields should work by adding some mongoose option:
    content: {
      type: String,
      default: "",
      required: true,
    },
    mediaUrl: {
      type: Object,
      default: {},
    },
    author: {
      type: Object,
      default: Object,
      required: true,
    },
  },
  { timestamps: true }
);

// This will create a table or collection if there is no table with that name already.
const postSchema = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default postSchema;
