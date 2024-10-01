import { CommandInteraction, SlashCommandStringOption, VoiceChannel,SlashCommandBooleanOption } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { StateManger } from "../../utils/StateManger";
import { getVoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { logger } from "../../utils/log";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('set_system').setDescription('設置系統prompt')
    .addStringOption((option: SlashCommandStringOption) => option.setName('prompt').setDescription('prompt').setRequired(true))

const chat = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();

    const controller = StateManger.getOllamaController()

    if (controller) {
        controller.system(interaction.options.get("prompt")?.value as string,interaction.channel?.id as string)
        
        await interaction.editReply(JSON.stringify(controller.getMem(interaction.channel?.id as string)));
    } else {
        await interaction.editReply("not init");
    }
}

const info: CommandInfo = {
    data: data,
    execute: chat
}


module.exports = info;
