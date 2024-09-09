"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fetch_1 = require("../../utils/fetch");
const log_1 = require("../../utils/log");
const getRandomPy_1 = require("../../utils/getRandomPy");
const fs_1 = __importDefault(require("fs"));
const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const sendOption = `${process.env.sdEndPoint}/sdapi/v1/options`;
const list = JSON.parse(fs_1.default.readFileSync(process.env.modelOption, 'utf-8'));
const data = new SlashCommandBuilder().setName('loadmodel').setDescription('更換模型').addStringOption((option) => option.setName('model').setDescription('模型').setRequired(true).addChoices(list));
const formater = (res) => {
    const resp = new discord_js_1.EmbedBuilder()
        .setColor(0x212121)
        .setTitle('更換模型')
        .setAuthor({ name: 'CWL機器人', iconURL: (0, getRandomPy_1.getRandomPy)() })
        .setDescription('更換SD模型')
        .addFields({ name: "message", value: res.message }, { name: "訊息", value: res.body })
        .setThumbnail((0, getRandomPy_1.getRandomPy)())
        .setTimestamp();
    return resp;
};
const loadModel = async (interaction) => {
    /**
     * 延遲回應
     */
    await interaction.deferReply();
    log_1.logger.info(`${interaction.user.globalName}: load model: ${interaction.options.get("model")?.value}`);
    const res = await (0, fetch_1.asyncPost)(sendOption, { sd_model_checkpoint: interaction.options.get("model") ? interaction.options.get("model")?.value : "" }).catch(err => {
        interaction.editReply({
            embeds: [formater({
                    code: "500",
                    message: err.error,
                    body: err.errors
                })]
        });
    });
    interaction.editReply({
        embeds: [formater({
                code: "200",
                message: "sucess",
                body: `${interaction.options.get("model")?.value} 更換成功`
            })]
    });
    interaction.editReply(interaction.options.get("model")?.value);
};
const info = {
    data: data,
    execute: loadModel
};
module.exports = info;
