"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fetch_1 = require("../../utils/fetch");
const getRandomPy_1 = require("../../utils/getRandomPy");
const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const data = new SlashCommandBuilder().setName('getmodel').setDescription('查sd模型表');
const api = `${process.env.sdEndPoint}/sdapi/v1/sd-models`;
const formater = (list) => {
    let ans = '';
    list.forEach(model => {
        ans += `\n${model.title}\n`;
    });
    const resp = new discord_js_1.EmbedBuilder()
        .setColor(0x212121)
        .setTitle('models')
        .setAuthor({ name: 'CWL機器人', iconURL: (0, getRandomPy_1.getRandomPy)() })
        .setDescription('SD可用模型表')
        .setThumbnail((0, getRandomPy_1.getRandomPy)())
        .addFields({ name: '模型表', value: ans, inline: true })
        .setTimestamp();
    return resp;
};
const getModels = async (interaction) => {
    /**
     * 延遲回應
     */
    await interaction.deferReply();
    const res = await (0, fetch_1.asyncGet)(api).catch(async (err) => {
        const temp = {
            code: "501",
            message: "伺服器錯誤",
            body: JSON.stringify(err)
        };
        interaction.editReply(JSON.stringify(temp));
    });
    await interaction.editReply({ embeds: [formater(res)] });
};
const info = {
    data: data,
    execute: getModels
};
module.exports = info;
