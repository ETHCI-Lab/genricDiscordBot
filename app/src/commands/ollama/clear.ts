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

const data = new SlashCommandBuilder().setName('clear_llama_mem').setDescription('清除當前 Session ollama 記憶')

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
    StateManger.getOllamaController()?.clear(interaction.channel?.id as string)
    interaction.editReply("孩子們 我失憶了")
}

const info: CommandInfo = {
    data: data,
    execute: loadModel
}

module.exports = info;
