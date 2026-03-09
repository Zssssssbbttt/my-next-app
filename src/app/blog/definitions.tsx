export interface Comment{
    id:string;
    postId:string;
    author:string;
    email:string;
    content:string;
    createdAt:string;
}

export const comments:Comment[]=[]