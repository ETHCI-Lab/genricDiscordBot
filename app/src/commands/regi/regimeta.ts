import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction, SlashCommandStringOption } from "discord.js";
import { asyncGet, asyncPost } from "../../utils/fetch";
import { logger } from "../../utils/log";
import { resp } from "../../utils/resp";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/getRandomPy";

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

const data = new SlashCommandBuilder().setName('regimeta').setDescription('註冊meta帳號')
	.addStringOption((option: SlashCommandStringOption) => option.setName('account').setDescription('帳號').setRequired(true))
	.addStringOption((option: SlashCommandStringOption) => option.setName('password').setDescription('密碼').setRequired(true))

const formater = (res:regiResp,interaction:CommandInteraction) => {
	try {
		const resp = new EmbedBuilder()
		.setColor(0x212121)
		.setTitle('註冊meta')
		.setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
		.setDescription(`${res.code == "200"?"註冊成功":"註冊失敗"}`)
		.setThumbnail(getRandomPy())
		.addFields(
			{ name: "_id", value: String(res.body._id), inline: false },
			{ name:"account", value:String(interaction.options.get("account")?.value), inline:false },
			{ name: "password", value: String(interaction.options.get("password")?.value), inline: false },
			{ name: "role", value: String(res.body.role), inline: true },
			{ name: "key", value: JSON.stringify(res.body.key), inline: true },
		)
		.setTimestamp()

		interaction.editReply({embeds:[resp]})
	} catch (error) {
		interaction.editReply(`error: ${error}`)
	}
}

const regimeta = async (interaction: CommandInteraction) => {
	await interaction.deferReply(); 
	const res: regiResp = await asyncPost(process.env.METARegiEndPoint as string, {
		name: interaction.options.get("account")?.value,
		password: interaction.options.get("password")?.value,
	},`Bearer${process.env.METAKEY}`);

	formater(res,interaction);
}

const info: CommandInfo = {
	data: data,
	execute: regimeta
}

module.exports = info;
