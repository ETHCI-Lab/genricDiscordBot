import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction, SlashCommandStringOption } from "discord.js";
import { asyncGet, asyncPost } from "../../utils/fetch";
import { logger } from "../../utils/log";
import { resp } from "../../utils/resp";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/embed/getRandomPy";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

type regiResp = resp<
	{
		"_id": string | null,
		"name": string | null,
		"password": string | null,
		"role": string | null,
		"key": string | null,
		"gptLog": string | null
	}
>

const data = new SlashCommandBuilder().setName('regiomg').setDescription('註冊omg帳號')
	.addStringOption((option: SlashCommandStringOption) => option.setName('account').setDescription('帳號').setRequired(true))
	.addStringOption((option: SlashCommandStringOption) => option.setName('email').setDescription('email').setRequired(true))
	.addStringOption((option: SlashCommandStringOption) => option.setName('password').setDescription('密碼').setRequired(true))

const formater = (res:string,interaction:CommandInteraction) => {
	try {
		const resp = new EmbedBuilder()
		.setColor(0x212121)
		.setTitle('註冊OMG')
		.setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
		.setDescription(`註冊成功`)
		.setThumbnail(getRandomPy())
		.addFields(
			{ name: "name", value: String(interaction.options.get("account")?.value), inline: true },
			{ name:"username", value:String(interaction.options.get("account")?.value), inline:true },
			{ name: "password", value: String(interaction.options.get("password")?.value), inline: true },
			{ name: "email", value: String(interaction.options.get("email")?.value), inline: true },
			{name:"info",value:JSON.stringify(res), inline: true}
		)
		.setTimestamp()

		interaction.editReply({embeds:[resp]})
	} catch (error) {
		interaction.editReply(`error: ${error}`)
	}
}

const regimeta = async (interaction: CommandInteraction) => {
	await interaction.deferReply(); 
	const res: string = await asyncPost(process.env.OMGRegiEndPoint as string,{
		name:interaction.options.get("account")?.value,
		username:interaction.options.get("account")?.value,
		email:interaction.options.get("email")?.value,
		password:interaction.options.get("password")?.value,
		confirm_password:interaction.options.get("password")?.value
	}).catch(error=>{
		interaction.editReply(`error: ${error}`)
	})

	formater(res,interaction);
}

const info: CommandInfo = {
	data: data,
	execute: regimeta
}

module.exports = info;
