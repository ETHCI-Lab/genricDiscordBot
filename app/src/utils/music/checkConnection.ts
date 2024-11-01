import { CommandInteraction } from "discord.js"
import { StateManger } from "../StateManger"
import { joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice"
import { logger } from "../log"

export const checkConnection = async (interaction:CommandInteraction)=>{
    const player = StateManger.getPlayer()
    const controller = StateManger.getPlayController()

    if (! controller?.connection) {
        //@ts-ignore
        const voiceChannel: VoiceChannel = interaction.member.voice.channel
        if (voiceChannel && interaction.guild) {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId as string,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })

            connection.on("error", (error) => {
                logger.error(error)
            })

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                logger.info("Disconnected ")
                controller?.clear()
            })

            if (player) {
                connection.subscribe(player);
            }
            
        }else{
            await interaction.editReply("不在頻道");
        }
    }
}