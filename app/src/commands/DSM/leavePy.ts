import { CommandInteraction, VoiceChannel } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { loginDSM } from "../../init/loginDSM";
import { StateManger } from "../../utils/StateManger";
import { getVoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { logger } from "../../utils/log";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('leave').setDescription('請培宇離開')

const playPy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();

    if (StateManger.getDSMSid() != undefined&&StateManger.getDSMCookie() != undefined) {
            //@ts-ignore
            const voiceChannel:VoiceChannel = interaction.member.voice.channel
            if (voiceChannel&&interaction.guild) {

                const connection = getVoiceConnection(voiceChannel.guild.id);

                connection?.on(VoiceConnectionStatus.Disconnected ,()=>{
                    logger.info("Disconnected ")
                    StateManger.getPlayController()?.clear()
                })

                connection?.disconnect()

                await interaction.editReply("孩子們 我要回去顧小孩了");

            }else{
                await interaction.editReply("不在頻道");
            }

    } else {
        await interaction.editReply("登入失敗");
        await loginDSM({
            name: process.env.SynnologyDsmUserName as string,
            password: process.env.SynnologyDsmPassword as string
        })
    }
}

const info: CommandInfo = {
    data: data,
    execute: playPy
}


module.exports = info;
