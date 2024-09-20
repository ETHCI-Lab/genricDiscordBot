import { CommandInteraction, SlashCommandStringOption } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { StateManger } from "../../utils/StateManger";
import { audioMeta } from "../../interfaces/audioMeta";
import { getPyAudio } from "../../utils/getPyAudio";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('insertmusic').setDescription('插入歌曲').addStringOption((option: SlashCommandStringOption) => option.setName('name').setDescription('歌名').setRequired(true))


const getpy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();
    const controller = StateManger.getPlayController()

    const resource = await getPyAudio(encodeURI(`/ETHCI/無損音檔/PeiYu Cheng/${interaction.options.get("name")?.value}`),interaction.options.get("name")?.value as string)

    controller?.insertMusic(resource)

    const meta:audioMeta | undefined = resource.metadata as audioMeta

    await interaction.editReply(`插入${meta?.name}`);
}

const info: CommandInfo = {
    data: data,
    execute: getpy
}

module.exports = info;