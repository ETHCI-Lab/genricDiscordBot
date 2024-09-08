import { CommandInteraction, EmbedBuilder } from "discord.js";
import { getRandomPy } from "../../utils/getRandomPy";

const { SlashCommandBuilder } = require('discord.js');

const formater = ():EmbedBuilder=>{
	const resp = new EmbedBuilder()
	.setColor(0x212121)
	.setTitle('ping!')
	.setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
	.setDescription('隨機培宇')
	.setThumbnail(getRandomPy())
	.addFields({ name: 'Pong!', value: `今日培宇:${getRandomPy()}`, inline: true })
	.setImage(getRandomPy())
	.setTimestamp()

	return resp
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction:CommandInteraction) {
		await interaction.reply({embeds:[formater()]});
	},
};