import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction, SlashCommandStringOption } from "discord.js";
import { asyncGet } from "../../utils/fetch";
import { logger } from "../../utils/log";
import { resp } from "../../utils/resp";
import { CommandInfo } from "../../interfaces/CommandInfo";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('regimeta').setDescription('註冊meta帳號')
.addStringOption((option:SlashCommandStringOption) =>option.setName('account').setDescription('帳號').setRequired(true))
.addStringOption((option:SlashCommandStringOption) =>option.setName('passwword').setDescription('密碼').setRequired(true))

// const api = `${process.env.sdEndPoint}/sdapi/v1/sd-models`

const regimeta = ()=>{
	
}

const info:CommandInfo = {
	data: data,
	execute:async (interaction: CommandInteraction)=>{await interaction.reply("還沒好")}
}

module.exports = info;
