import { Tool } from "ollama";
import { sdResp } from "../../../interfaces/sdResp"
import { asyncPost } from "../../fetch"
require('dotenv').config()

export const txt2img = async(args: { [key: string]: any }):Promise<{
    body:sdResp,
    text:string
}> =>{
    
    const api = `${process.env.sdEndPoint}/sdapi/v1/txt2img`;

    const prompt = args.prompt;
    const negative_prompt = args.negative_prompt;

    const resp:sdResp =await asyncPost(api, {
        prompt: prompt,
		width: 512,
		height: 512,
		negative_prompt: negative_prompt
    })
    
    return {
        body:resp,
        text:JSON.stringify(resp)
    }
}

export const txt2imgInfo:Tool = {
    type: "function",
    function: {
        name: "txt2img",
        description: "需要時可以呼叫, 根據描述生成一張圖片, 也可以幫用戶補足沒提到細節以豐富圖片",
        parameters: {
            type: "object",
            required: [],
            properties: {
                prompt: {
                    type: "string",
                    description: "描述要生成的圖片"
                },
                negative_prompt: {
                    type: "string",
                    description: "描述要生成的圖片裡面不應該包含的東西"
                }
            }
        }
    }
}