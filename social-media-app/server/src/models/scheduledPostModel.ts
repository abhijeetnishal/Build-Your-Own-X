import mongoose from "mongoose";

const ScheduledPostSchema = new mongoose.Schema(
  {
    // Define schema fields based on the ScheduledPost interface
    content: {
      type: String,
      required: true,
      default: "",
    },
    media: {
      type: Object,
      default: {},
    },
    scheduledTime: {
      type: Date,
      required: true,
      default: new Date(),
    },
    author: {
      type: Object,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

export const scheduledPostSchema =
  mongoose.models.ScheduledPost ||
  mongoose.model("ScheduledPost", ScheduledPostSchema);
