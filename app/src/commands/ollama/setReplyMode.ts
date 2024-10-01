import { CommandInteraction, SlashCommandStringOption } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { StateManger } from "../../utils/StateManger";
const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('set_llama_reply_mode').setDescription('更換ollama回應模式')
    .addStringOption((option: SlashCommandStringOption) => option.setName('mode').setDescription('模式').setRequired(true).addChoices(
        { name: 'stream', value: 'stream' },
        { name: 'await', value: 'await' }
    ))

const loadModel = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();
    StateManger.getOllamaController()?.setReplyMode(interaction.options.get(`mode`)?.value as "stream" | "await")
    switch (interaction.options.get(`mode`)?.value) {
        case "stream":
            interaction.editReply("孩子們 我會慢慢說話")
            break;
        case "await":
            interaction.editReply("我馬上回來")
            break;

        default:
            break;
    }
}

const info: CommandInfo = {
    data: data,
    execute: loadModel
}

module.exports = info;
