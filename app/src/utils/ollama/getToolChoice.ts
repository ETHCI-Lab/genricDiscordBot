import { APIApplicationCommandOptionChoice } from "discord.js"
import { toolRoutes } from "../../init/toolRouter"

export const getToolChoice = ():Array<APIApplicationCommandOptionChoice<string>>=>{
    const choice:Array<APIApplicationCommandOptionChoice<string>> = []
    toolRoutes.forEach((tool)=>{
        choice.push({
            name: tool.id,
            value: tool.id
        })
    })
    return choice
}