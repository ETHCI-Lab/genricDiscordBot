"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const data = new SlashCommandBuilder().setName('regimeta').setDescription('註冊meta帳號')
    .addStringOption((option) => option.setName('account').setDescription('帳號').setRequired(true))
    .addStringOption((option) => option.setName('passwword').setDescription('密碼').setRequired(true));
// const api = `${process.env.sdEndPoint}/sdapi/v1/sd-models`
const regimeta = () => {
};
const info = {
    data: data,
    execute: async (interaction) => { await interaction.reply("還沒好"); }
};
module.exports = info;
