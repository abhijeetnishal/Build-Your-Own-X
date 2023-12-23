export type Post = {
    postContent: string;
    postImage: string,
    postVideo: string,
    author: {
        id: string;
        name: string;
    }
}