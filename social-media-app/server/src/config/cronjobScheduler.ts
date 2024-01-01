import cron from "node-cron";
import { scheduledPostSchema } from "../models/scheduledPostModel";
import { deletePost, savePost } from "../service/postService";
import postSchema from "../models/postModel";

// Run every 2 minute
const task = cron.schedule(
  "*/2 * * * *",
  async () => {
    const now = new Date();
    const scheduledPosts = await scheduledPostSchema.find({
      time: { $lte: now.toISOString() },
    });

    await postSchema.insertMany(scheduledPosts);
    await scheduledPostSchema.deleteMany({ time: { $lte: now.toISOString() } });
  },
  {
    scheduled: false,
  }
);

export { task };
