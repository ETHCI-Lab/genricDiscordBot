"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const getRandomPy_1 = require("../../utils/getRandomPy");
const { SlashCommandBuilder } = require('discord.js');
const formater = () => {
    const resp = new discord_js_1.EmbedBuilder()
        .setColor(0x212121)
        .setTitle('ping!')
        .setAuthor({ name: 'CWL機器人', iconURL: (0, getRandomPy_1.getRandomPy)() })
        .setDescription('隨機培宇')
        .setThumbnail((0, getRandomPy_1.getRandomPy)())
        .addFields({ name: 'Pong!', value: `今日培宇:${(0, getRandomPy_1.getRandomPy)()}`, inline: true })
        .setImage((0, getRandomPy_1.getRandomPy)())
        .setTimestamp();
    return resp;
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply({ embeds: [formater()] });
    },
};
