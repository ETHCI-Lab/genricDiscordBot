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

export const getAllSession = async(args: { [key: string]: any }):Promise<info[]> =>{
    
    const api = `http://163.13.201.152:8877/Session/getAllSessions`;

    const infos:resp<info[]> = {
        code: "",
        message: "",
        body: []
    }

    const sessions:resp<Session[]> = await asyncGet(api)

    infos.code = sessions.code
    infos.message = sessions.message
    sessions.body.forEach((session)=>{
        infos.body.push({
            _id:session._id,
            user:session.user,
            model:session.model,
            title:session.title,
            createdAt:session.createdAt,
            updatedAt:session.updatedAt,
        })
    })

    return infos.body
}

export const getAllSessionInfo:Tool = {
    type: "function",
    function: {
        name: "getAllSession",
        description: "Call this function to get all Session history of users from DataBase",
        parameters: {
            type: "object",
            required: [],
            properties: {
            }
        }
    }
}