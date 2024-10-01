import { AttachmentBuilder, Client, Events } from "discord.js";
import { logger } from "../utils/log";
import { StateManger } from "../utils/StateManger";
import { Tool } from "ollama";
import { toolRoutes } from "./toolRouter";
require('dotenv').config()
export const setReply = (client: Client) => {

    let channelIds = process.env.enableReplyChannel as string
    const channelIdArr = channelIds.split(",")
    const controller = StateManger.getOllamaController()
    const tools:Tool[] = []

    toolRoutes.forEach(tool=>{
        tools.push(tool.info)
    })

    client.on('messageCreate', async interaction => {
        const channelId = interaction.channelId

        if (channelIdArr?.indexOf(channelId) != -1 && !interaction.author.bot) {
            if (controller) {
                try {
                    const message = await interaction.channel.send("...");
                    let resp = ""
                    let llamaResp
                    switch (controller.getReplyMode()) {
                        case "stream":
                            llamaResp = await controller.sendChatStream(interaction.content, channelId);
                            if (llamaResp) {
                                for await (const part of llamaResp) {
                                    resp += part.message.content
                                    await message.edit(resp)
                                }
                            }
                            break;
                        case "await":
                            llamaResp = await controller.sendChat(interaction.content, channelId,tools,"mannix/llama3-groq-tool-8b:latest");
                            if (llamaResp) {
                                if (llamaResp.img) {
                                    await message.edit({content:llamaResp.message.content,files:[new AttachmentBuilder(Buffer.from(llamaResp.img.images[0], 'base64'), { name: `image0.png` })]});
                                }else{
                                    await message.edit(llamaResp.message.content)
                                }
                            }
                            break;

                        default:
                            break;
                    }

                } catch (error) {
                    logger.error(error)
                }
            }

        }
    });
}