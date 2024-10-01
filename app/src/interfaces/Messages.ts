import { File } from "./File"

export interface Messages{
    _id:string;
    user:string;
    messageId:string;
    __v:number;
    _meiliIndex:boolean;
    conversationId:string;
    createdAt:string;
    endpoint:string;
    error:false;
    isCreatedByUser:boolean;
    isEdited:boolean;
    model:string;
    parentMessageId:string;
    sender:string;
    text:string;
    tokenCount:number;
    unfinished:boolean;
    updatedAt:string;
    files:File[]
}