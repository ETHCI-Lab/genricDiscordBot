import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction } from "discord.js";
import { asyncGet } from "../../utils/fetch";
import { logger } from "../../utils/log";
import { resp } from "../../utils/resp";
import { CommandInfo } from "../../interfaces/CommandInfo";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('getmodel').setDescription('查sd模型表')

const api = `${process.env.sdEndPoint}/sdapi/v1/sd-models`

const formater = (list:Array<{title:string, model_name:string}>):EmbedBuilder=>{
	let ans = ''
	list.forEach(model=>{
		ans +=`\n${model.title}\n`
	})

	const resp = new EmbedBuilder()
	.setColor(0x212121)
	.setTitle('models')
	.setAuthor({ name: 'CWL機器人', iconURL: 'https://omg.ethci.app/images/66d72cbb0ce1e345dd729031/f060b214-4143-412b-8b9b-cfc14047b4f8__messageImage_1725727051480%201.png' })
	.setDescription('SD可用模型表')
	.setThumbnail('https://omg.ethci.app/images/66d72cbb0ce1e345dd729031/810b55f2-cafb-4896-aaf1-89a63319e0ab__image%203.png')
	.addFields({ name: '模型表', value: ans, inline: true })
	.setTimestamp()

	return resp
}

const getModels = async (interaction: CommandInteraction) => {

	/**
	 * 延遲回應
	 */
	await interaction.deferReply();

	const res = await asyncGet(api).catch(async (err) => {

		const temp: resp<string> = {
			code: "501",
			message: "伺服器錯誤",
			body: JSON.stringify(err)
		}

		interaction.editReply(JSON.stringify(temp))
	})

	await interaction.editReply({ embeds: [formater(res)] })

}

const info:CommandInfo = {
	data: data,
	execute:getModels
}

module.exports = info;
