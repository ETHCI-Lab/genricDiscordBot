import { Client, Events } from "discord.js";
import { logger } from "../utils/log";
import { StateManger } from "../utils/StateManger";
require('dotenv').config()
export const setReply = (client: Client) => {

    let channelIds = process.env.enableReplyChannel as string
    const channelIdArr = channelIds.split(",")
    const controller = StateManger.getOllamaController()

    client.on('messageCreate', async interaction => {
        const channelId = interaction.channelId

        logger.info(channelIdArr?.indexOf(channelId))

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
                            llamaResp = await controller.sendChat(interaction.content, channelId);
                            if (llamaResp) {
                                await message.edit(llamaResp.message.content)
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