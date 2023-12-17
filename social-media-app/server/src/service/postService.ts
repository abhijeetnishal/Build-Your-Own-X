import postSchema from "../models/postModel";

const getAllPosts = (query: object) => {
    return new Promise(
        async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
            const userPosts = await postSchema.find(query).sort({ updatedAt: -1 });

            if (userPosts) {
                resolve(userPosts);
            } else {
                reject("Something went wrong!");
            }
        }
    );
};

const savePost = (data: object) => {
    return new Promise(
        async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
            // Create a new post
            const newPost = new postSchema(data);
            const post = await newPost.save();

            if (post) {
                resolve(post);
            } else {
                reject("Something went wrong!");
            }
        }
    );
};

export { getAllPosts, savePost };
