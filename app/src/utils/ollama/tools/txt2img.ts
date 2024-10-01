import { Tool } from "ollama";
import { sdResp } from "../../../interfaces/sdResp"
import { asyncPost } from "../../fetch"
require('dotenv').config()

export const txt2img = async(args: { [key: string]: any }):Promise<sdResp> =>{
    
    const api = `${process.env.sdEndPoint}/sdapi/v1/txt2img`;

    const prompt = args.prompt;
    const negative_prompt = args.negative_prompt;

    const resp:sdResp =await asyncPost(api, {
        prompt: prompt,
		width: 512,
		height: 512,
		negative_prompt: negative_prompt
    })
    
    return resp
}

export const txt2imgInfo:Tool = {
    type: "function",
    function: {
        name: "txt2img",
        description: "Call this function to Generates an image from a text prompt with an option to provide negative prompts.",
        parameters: {
            type: "object",
            required: [],
            properties: {
                prompt: {
                    type: "string",
                    description: "The text prompt based on which the image is generated."
                },
                negative_prompt: {
                    type: "string",
                    description: "Negative text prompts that depict what should not be included in the image."
                }
            }
        }
    }
}