import { Tool } from "ollama";
import { asyncGet } from "../../fetch";
import { resp } from "../../resp";
import { logger } from "../../log";
import { Session } from "../../../interfaces/session";

type info = {
    _id:string,
    userName:string,
    model:string,
    title:string,
    createdAt:string,
    updatedAt:string,
}

export const getAllSession = async(args: { [key: string]: any }):Promise<{
    body:info[],
    text:string
}> =>{
    
    const api = `http://163.13.201.152:8877/Session/getAllSessions`;

    const user:string | undefined = args.user;

    const infos:resp<info[]> = {
        code: "",
        message: "",
        body: []
    }

    
    const sessions:resp<Session[]> = await asyncGet(api)

    infos.code = sessions.code
    infos.message = sessions.message
    sessions.body.forEach((session)=>{
        if (user) {
            if (session.user === user) {
                infos.body.push({
                    _id:session._id,
                    userName:session.user,
                    model:session.model,
                    title:session.title,
                    createdAt:session.createdAt,
                    updatedAt:session.updatedAt,
                })
            }
        }else{
            infos.body.push({
                _id:session._id,
                userName:session.user,
                model:session.model,
                title:session.title,
                createdAt:session.createdAt,
                updatedAt:session.updatedAt,
            })
        }

    })

    return {
        body:infos.body,
        text:JSON.stringify(Text)
    }
}

export const getAllSessionInfo:Tool = {
    type: "function",
    function: {
        name: "getAllSession",
        description: "需要時可以呼叫, 從 omg 平台取得用戶與ai對話紀錄",
        parameters: {
            type: "object",
            required: [],
            properties: {
                user: {
                    type: "string",
                    description: "如果只查一位用戶, 這個參數填用戶名"
                }
            }
        }
    }
}