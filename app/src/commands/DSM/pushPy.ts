import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction, SlashCommandStringOption, VoiceChannel } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { loginDSM } from "../../init/loginDSM";
import { StateManger } from "../../utils/StateManger";
import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { getPyAudio } from "../../utils/music/getPyAudio";
import { logger } from "../../utils/log";
import { checkConnection } from "../../utils/music/checkConnection";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('pushmusic').setDescription('推入培宇音樂').addStringOption((option: SlashCommandStringOption) => option.setName('name').setDescription('歌名').setRequired(true))

const playPy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();

    const player = StateManger.getPlayer()
    const controller = StateManger.getPlayController()

    await checkConnection(interaction)

    if (StateManger.getDSMSid() != undefined && StateManger.getDSMCookie() != undefined) {
        const resource = await getPyAudio(encodeURI(`/ETHCI/無損音檔/PeiYu Cheng/${interaction.options.get("name")?.value}`),interaction.options.get("name")?.value as string)
        if (player && resource) {
            controller?.pushMusic(resource);
        }
    }
}

const info: CommandInfo = {
    data: data,
    execute: playPy
}


module.exports = info;
