import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction, SlashCommandStringOption } from "discord.js";
import { asyncGet, asyncPost } from "../../utils/fetch";
import { logger } from "../../utils/log";
import { resp } from "../../utils/resp";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/getRandomPy";
import fs from "fs"
const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const sendOption = `${process.env.sdEndPoint}/sdapi/v1/options`

const list: Array<{ name: string, value: string }> = JSON.parse(fs.readFileSync(process.env.modelOption as string, 'utf-8'));

const data = new SlashCommandBuilder().setName('loadmodel').setDescription('更換模型').addStringOption((option: SlashCommandStringOption) => option.setName('model').setDescription('模型').setRequired(true).addChoices(list))

const formater = (res: resp<string>): EmbedBuilder => {

    const resp = new EmbedBuilder()
        .setColor(0x212121)
        .setTitle('更換模型')
        .setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
        .setDescription('更換SD模型')
        .addFields(
            { name: "message", value: res.message },
            { name: "訊息", value: res.body },
            { name: "本地模型" , value: `${String(list.length)}個` }
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

    logger.info(`${interaction.user.globalName}: load model: ${interaction.options.get("model")?.value}`)

    const res = await asyncPost(sendOption, { sd_model_checkpoint: interaction.options.get("model") ? interaction.options.get("model")?.value as string : "" }).catch(err => {
        interaction.editReply({
            embeds: [formater({
                code: "500",
                message: err.error,
                body: err.errors
            })]
        })
    })

    interaction.editReply({
        embeds: [formater({
            code: "200",
            message: "sucess",
            body: `${interaction.options.get("model")?.value} 更換成功`
        })]
    })

    interaction.editReply(interaction.options.get("model")?.value as string)
}

const info: CommandInfo = {
    data: data,
    execute: loadModel
}

module.exports = info;
