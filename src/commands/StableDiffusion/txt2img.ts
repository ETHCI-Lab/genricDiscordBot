import { CommandInteraction, EmbedBuilder, SlashCommandIntegerOption, SlashCommandStringOption,AttachmentBuilder } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { asyncPost } from "../../utils/fetch";
import { sdPrompt } from "../../interfaces/sdPrompt";
import { sdResp } from "../../interfaces/sdResp";
import { logger } from "../../utils/log";
import { error } from "jquery";

const { SlashCommandBuilder } = require('discord.js');

require('dotenv').config()

const data:typeof SlashCommandBuilder = new SlashCommandBuilder().setName('txt2img').setDescription('genrate img')
.addStringOption((option:SlashCommandStringOption) =>option.setName('prompt').setDescription('prompt').setRequired(true))
.addIntegerOption((option:SlashCommandIntegerOption) =>option.setName('width').setDescription('width').setRequired(true).addChoices({ name: 'm', value: 512 },{ name: 'L', value: 1024 }))
.addIntegerOption((option:SlashCommandIntegerOption) =>option.setName('height').setDescription('height').setRequired(true).addChoices({ name: 'm', value: 512 },{ name: 'L', value: 1024 }))
.addStringOption((option:SlashCommandStringOption) =>option.setName('negative_prompt').setDescription('negative_prompt').setRequired(false))

const formater = (info:sdResp,interaction: CommandInteraction):{emb:EmbedBuilder,img:AttachmentBuilder[]}=>{

	const temp:Array<AttachmentBuilder> = [];

	// info.images.forEach(img=>{
	// 	let buffer = Buffer.from(img, 'base64')
	// 	temp.push(new AttachmentBuilder(buffer,{name:`${index}image.png`}))
	// 	index++
	// })

	for (let index = 0; index < info.images.length; index++) {
		temp.push(new AttachmentBuilder(Buffer.from(info.images[index], 'base64'),{name:`image${index}.png`}))
	}

	// let tempImg = new AttachmentBuilder(Buffer.from(info.images[0], 'base64'),{name:`image.png`})
	
	const resp = new EmbedBuilder()
	.setColor(0x212121)
	.setTitle('text to image')
	.setAuthor({ name: 'CWL機器人', iconURL: 'https://omg.ethci.app/images/66d72cbb0ce1e345dd729031/f060b214-4143-412b-8b9b-cfc14047b4f8__messageImage_1725727051480%201.png' })
	.setDescription(`${interaction.user.displayName} 呼叫生成`)
	.setImage(`attachment://image0.png`)
	.setThumbnail('https://omg.ethci.app/images/66d72cbb0ce1e345dd729031/810b55f2-cafb-4896-aaf1-89a63319e0ab__image%203.png')
	.setTimestamp()

	return {
		emb:resp,
		img:temp
	}
}

const setBody = (interaction: CommandInteraction): sdPrompt => {
	return {
		prompt:  interaction.options.get("prompt")?interaction.options.get("prompt")?.value as string:"",
		width:  interaction.options.get("width")?interaction.options.get("width")?.value as number:512,
		height: interaction.options.get("width")?interaction.options.get("height")?.value as number:512,
		negative_prompt: interaction.options.get("negative_prompt")?.value as string
	}
}

const txt2img = async (interaction: CommandInteraction) => {

	await interaction.deferReply();

	const api = `${process.env.sdEndPoint}/sdapi/v1/txt2img`;

	logger.info(JSON.stringify(setBody(interaction)))

	const resp:sdResp = await asyncPost(api, setBody(interaction)).catch(error=>{
		logger.error(error)
	})

	const ans = formater(resp,interaction)

	await interaction.editReply({embeds:[ans.emb],files:ans.img});
}

const info: CommandInfo = {
	data: data,
	execute: txt2img
}

module.exports = info;
