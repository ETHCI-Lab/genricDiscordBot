import { Messages } from "./Messages";


export interface Session{
    _id:string,
    user:string,
    avatar:string,
    model:string,
    title:string,
    createdAt:string,
    updatedAt:string,
    messages:Messages[],
}