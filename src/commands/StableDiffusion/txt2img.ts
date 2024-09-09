import { CommandInteraction, EmbedBuilder, SlashCommandIntegerOption, SlashCommandStringOption, AttachmentBuilder } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { asyncPost } from "../../utils/fetch";
import { sdPrompt } from "../../interfaces/sdPrompt";
import { sdResp } from "../../interfaces/sdResp";
import { logger } from "../../utils/log";
import { getRandomPy } from "../../utils/getRandomPy";
import { getDominantColor } from "../../utils/getDominantColor";

const { SlashCommandBuilder } = require('discord.js');

require('dotenv').config()

const data: typeof SlashCommandBuilder = new SlashCommandBuilder().setName('txt2img').setDescription('生成圖片')
	.addStringOption((option: SlashCommandStringOption) => option.setName('prompt').setDescription('prompt').setRequired(true))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('width').setDescription('width').setRequired(true).addChoices({ name: 'm', value: 512 }, { name: 'L', value: 1024 }))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('height').setDescription('height').setRequired(true).addChoices({ name: 'm', value: 512 }, { name: 'L', value: 1024 }))
	.addStringOption((option: SlashCommandStringOption) => option.setName('negative_prompt').setDescription('negative_prompt').setRequired(false))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('seed').setDescription('seed').setRequired(false))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('subseed').setDescription('subseed').setRequired(false))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('subseed_strength').setDescription('subseed_strength').setRequired(false))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('seed_resize_from_h').setDescription('seed_resize_from_h').setRequired(false))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('seed_resize_from_w').setDescription('seed_resize_from_w').setRequired(false))
	.addStringOption((option: SlashCommandStringOption) => option.setName('sampler_name').setDescription('sampler_name').setRequired(false).addChoices(
		{ name: 'DPM++ 2M', value: 'DPM++ 2M' },
		{ name: 'DPM++ SDE', value: 'DPM++ SDE' },
		{ name: 'DPM++ 2M SDE Heun', value: 'DPM++ 2M SDE Heun' },
		{ name: 'DPM++ 2S a', value: 'DPM++ 2S a' },
		{ name: 'DPM++ 3M SDE', value: 'DPM++ 3M SDE' },
		{ name: 'Euler a', value: 'Euler a' },
		{ name: 'Euler', value: 'Euler' },
		{ name: 'LMS', value: 'LMS' },
		{ name: 'Heun', value: 'Heun' },
		{ name: 'DPM2', value: 'DPM2' },
		{ name: 'DPM2 a', value: 'DPM2 a' },
		{ name: 'DPM fast', value: 'DPM fast' },
		{ name: 'DPM adaptive', value: 'DPM adaptive' }
	))
	.addStringOption((option: SlashCommandStringOption) => option.setName('scheduler').setDescription('scheduler').setRequired(false).addChoices(
		{ name: 'Automatic', value: 'Automatic' },
		{ name: 'Uniform', value: 'Uniform' },
		{ name: 'Karras', value: 'Karras' },
		{ name: 'Exponential', value: 'Exponential' },
		{ name: 'Polyexponential', value: 'Polyexponential' },
		{ name: 'SGM Uniform', value: 'SGM Uniform' },
	))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('batch_size').setDescription('batch_size').setRequired(false))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('n_iter').setDescription('n_iter').setRequired(false))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('steps').setDescription('steps').setRequired(false))
	.addIntegerOption((option: SlashCommandIntegerOption) => option.setName('cfg_scale').setDescription('cfg_scale').setRequired(false))

const formater = async (info: sdResp, interaction: CommandInteraction) => {

	const temp: Array<AttachmentBuilder> = [];
	const emb: Array<EmbedBuilder> = []

	for (let index = 0; index < info.images.length; index++) {
		temp.push(new AttachmentBuilder(Buffer.from(info.images[index], 'base64'), { name: `image${index}.png` }))
	}

	const color = await getDominantColor(Buffer.from(info.images[0], 'base64'))

	const args: Array<{ name: string, value: any, inline: boolean }> = []

	const parsedData: Array<{ [key: string]: any }> = JSON.parse(info.info);

	let count = 0;

	Object.keys(parsedData).forEach((key) => {
		//@ts-ignore
		if (info.parameters[key] != null && count < 25) {
			let inline = true
			if (key == "prompt") {
				inline = false
			}
			if (key == "negative_prompt") {
				inline = false
			}
			//@ts-ignore
			args.push({ name: key, value: String(info.parameters[key] ? info.parameters[key] : null), inline: inline })
			count++
		}
	})

	try {
		const resp = new EmbedBuilder()
			.setURL("https://mdfk.ethci.app/")
			//@ts-ignore
			.setColor(color?color:0x212121)
			//@ts-ignore
			.setTitle(`text to image`)
			.setAuthor({ name: 'CWL機器人', iconURL: 'https://omg.ethci.app/images/66d72cbb0ce1e345dd729031/f060b214-4143-412b-8b9b-cfc14047b4f8__messageImage_1725727051480%201.png' })
			.setDescription(`${interaction.user.displayName} 呼叫生成`)
			.setImage(`attachment://image0.png`)
			.addFields(args)
			.setThumbnail(getRandomPy())
			.setTimestamp()
			//@ts-ignore
			.setFooter({ text: `${parsedData['sd_model_name']}: ${parsedData['version']}` })

		emb.push(resp)
		for (let index = 1; index < temp.length; index++) {
			emb.push(new EmbedBuilder().setURL("https://mdfk.ethci.app/").setTitle(`image${index}.png`).setImage(`attachment://image${index}.png`))
		}
		interaction.editReply({ embeds: emb, files: temp });
	} catch (error) {
		interaction.editReply(`message: ${String(error)}`);
	}
}

const setBody = (interaction: CommandInteraction): sdPrompt => {
	return {
		prompt: interaction.options.get("prompt") ? interaction.options.get("prompt")?.value as string : "",
		width: interaction.options.get("width") ? interaction.options.get("width")?.value as number : 512,
		height: interaction.options.get("width") ? interaction.options.get("height")?.value as number : 512,
		negative_prompt: interaction.options.get("negative_prompt")?.value as string,
		seed: interaction.options.get("seed") ? interaction.options.get("seed")?.value as number : -1,
		subseed: interaction.options.get("subseed") ? interaction.options.get("subseed")?.value as number : undefined,
		subseed_strength: interaction.options.get("subseed_strength") ? interaction.options.get("subseed_strength")?.value as number : undefined,
		seed_resize_from_h: interaction.options.get("seed_resize_from_h") ? interaction.options.get("seed_resize_from_h")?.value as number : undefined,
		seed_resize_from_w: interaction.options.get("seed_resize_from_w") ? interaction.options.get("seed_resize_from_w")?.value as number : undefined,
		sampler_name: interaction.options.get("sampler_name") ? interaction.options.get("sampler_name")?.value as string : undefined,
		scheduler: interaction.options.get("scheduler") ? interaction.options.get("scheduler")?.value as string : undefined,
		batch_size: interaction.options.get("batch_size") ? interaction.options.get("batch_size")?.value as number : undefined,
		n_iter: interaction.options.get("n_iter") ? interaction.options.get("n_iter")?.value as number : undefined,
		steps: interaction.options.get("steps") ? interaction.options.get("steps")?.value as number : undefined,
		cfg_scale: interaction.options.get("cfg_scale") ? interaction.options.get("cfg_scale")?.value as number : 7
	}
}

const txt2img = async (interaction: CommandInteraction) => {

	await interaction.deferReply();

	const api = `${process.env.sdEndPoint}/sdapi/v1/txt2img`;

	logger.info(`${interaction.user.globalName}: ${JSON.stringify(setBody(interaction))}`)

	const resp: sdResp = await asyncPost(api, setBody(interaction)).catch(error => {
		logger.error(`api: ${error}`)
	})
	formater(resp, interaction)
}

const info: CommandInfo = {
	data: data,
	execute: txt2img
}

module.exports = info;
