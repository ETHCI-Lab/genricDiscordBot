import { APIApplicationCommandOptionChoice, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction, SlashCommandStringOption } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/embed/getRandomPy";
import { StateManger } from "../../utils/StateManger";
const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const list = StateManger.getOllamaController()?.modelList;

const choice:APIApplicationCommandOptionChoice<string>[] = []

list?.forEach(model=>{
    choice.push({
        name: model.name,
        value: model.name
    })
})

const data = new SlashCommandBuilder().setName('loadllamamodel').setDescription('更換ollama模型').addStringOption((option: SlashCommandStringOption) => option.setName('model').setDescription('模型').setRequired(true).addChoices(choice))

const formater = (interaction: CommandInteraction): EmbedBuilder => {

    const resp = new EmbedBuilder()
        .setColor(0x212121)
        .setTitle('更換模型')
        .setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
        .setDescription('更換Ollama模型')
        .addFields(
            { name: "本地模型" , value: `${interaction.options.get(`model`)?.value as string}` }
        )
        .setThumbnail(getRandomPy())
        .setTimestamp()

    return resp
}

const loadModel = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();
    StateManger.getOllamaController()?.setModel(interaction.options.get(`model`)?.value as string)
    interaction.editReply({embeds:[formater(interaction)]})
}

const info: CommandInfo = {
    data: data,
    execute: loadModel
}

module.exports = info;
