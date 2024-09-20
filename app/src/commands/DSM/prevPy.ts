import { CommandInteraction } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { StateManger } from "../../utils/StateManger";
import { audioMeta } from "../../interfaces/audioMeta";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('prevmusic').setDescription('切換上一首')


const getpy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();
    const controller = StateManger.getPlayController()

    const meta:audioMeta | undefined = await controller?.playPrev()

    await interaction.editReply(`切換至${meta?.name}`);
}

const info: CommandInfo = {
    data: data,
    execute: getpy
}

module.exports = info;