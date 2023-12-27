export type Post = {
    content: string;
    media?: Object;
    author: {
        id: string;
        name: string;
    }
}