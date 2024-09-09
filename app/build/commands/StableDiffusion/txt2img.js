"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fetch_1 = require("../../utils/fetch");
const log_1 = require("../../utils/log");
const getRandomPy_1 = require("../../utils/getRandomPy");
const getDominantColor_1 = require("../../utils/getDominantColor");
const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const data = new SlashCommandBuilder().setName('txt2img').setDescription('生成圖片')
    .addStringOption((option) => option.setName('prompt').setDescription('prompt').setRequired(true))
    .addIntegerOption((option) => option.setName('width').setDescription('width').setRequired(true).addChoices({ name: 'm', value: 512 }, { name: 'L', value: 1024 }))
    .addIntegerOption((option) => option.setName('height').setDescription('height').setRequired(true).addChoices({ name: 'm', value: 512 }, { name: 'L', value: 1024 }))
    .addStringOption((option) => option.setName('negative_prompt').setDescription('negative_prompt').setRequired(false))
    .addIntegerOption((option) => option.setName('seed').setDescription('seed').setRequired(false))
    .addIntegerOption((option) => option.setName('subseed').setDescription('subseed').setRequired(false))
    .addIntegerOption((option) => option.setName('subseed_strength').setDescription('subseed_strength').setRequired(false))
    .addIntegerOption((option) => option.setName('seed_resize_from_h').setDescription('seed_resize_from_h').setRequired(false))
    .addIntegerOption((option) => option.setName('seed_resize_from_w').setDescription('seed_resize_from_w').setRequired(false))
    .addStringOption((option) => option.setName('sampler_name').setDescription('sampler_name').setRequired(false).addChoices({ name: 'DPM++ 2M', value: 'DPM++ 2M' }, { name: 'DPM++ SDE', value: 'DPM++ SDE' }, { name: 'DPM++ 2M SDE Heun', value: 'DPM++ 2M SDE Heun' }, { name: 'DPM++ 2S a', value: 'DPM++ 2S a' }, { name: 'DPM++ 3M SDE', value: 'DPM++ 3M SDE' }, { name: 'Euler a', value: 'Euler a' }, { name: 'Euler', value: 'Euler' }, { name: 'LMS', value: 'LMS' }, { name: 'Heun', value: 'Heun' }, { name: 'DPM2', value: 'DPM2' }, { name: 'DPM2 a', value: 'DPM2 a' }, { name: 'DPM fast', value: 'DPM fast' }, { name: 'DPM adaptive', value: 'DPM adaptive' }))
    .addStringOption((option) => option.setName('scheduler').setDescription('scheduler').setRequired(false).addChoices({ name: 'Automatic', value: 'Automatic' }, { name: 'Uniform', value: 'Uniform' }, { name: 'Karras', value: 'Karras' }, { name: 'Exponential', value: 'Exponential' }, { name: 'Polyexponential', value: 'Polyexponential' }, { name: 'SGM Uniform', value: 'SGM Uniform' }))
    .addIntegerOption((option) => option.setName('batch_size').setDescription('batch_size').setRequired(false))
    .addIntegerOption((option) => option.setName('n_iter').setDescription('n_iter').setRequired(false))
    .addIntegerOption((option) => option.setName('steps').setDescription('steps').setRequired(false))
    .addIntegerOption((option) => option.setName('cfg_scale').setDescription('cfg_scale').setRequired(false));
const formater = async (info, interaction) => {
    const temp = [];
    const emb = [];
    for (let index = 0; index < info.images.length; index++) {
        temp.push(new discord_js_1.AttachmentBuilder(Buffer.from(info.images[index], 'base64'), { name: `image${index}.png` }));
    }
    const color = await (0, getDominantColor_1.getDominantColor)(Buffer.from(info.images[0], 'base64'));
    const args = [];
    const parsedData = JSON.parse(info.info);
    let count = 0;
    Object.keys(parsedData).forEach((key) => {
        //@ts-ignore
        if (info.parameters[key] != null && count < 25) {
            let inline = true;
            if (key == "prompt") {
                inline = false;
            }
            if (key == "negative_prompt") {
                inline = false;
            }
            //@ts-ignore
            args.push({ name: key, value: String(info.parameters[key] ? info.parameters[key] : null), inline: inline });
            count++;
        }
    });
    try {
        const resp = new discord_js_1.EmbedBuilder()
            .setURL("https://mdfk.ethci.app/")
            //@ts-ignore
            .setColor(color ? color : 0x212121)
            //@ts-ignore
            .setTitle(`text to image`)
            .setAuthor({ name: 'CWL機器人', iconURL: 'https://omg.ethci.app/images/66d72cbb0ce1e345dd729031/f060b214-4143-412b-8b9b-cfc14047b4f8__messageImage_1725727051480%201.png' })
            .setDescription(`${interaction.user.displayName} 呼叫生成`)
            .setImage(`attachment://image0.png`)
            .addFields(args)
            .setThumbnail((0, getRandomPy_1.getRandomPy)())
            .setTimestamp()
            //@ts-ignore
            .setFooter({ text: `${parsedData['sd_model_name']}: ${parsedData['version']}` });
        emb.push(resp);
        for (let index = 1; index < temp.length; index++) {
            emb.push(new discord_js_1.EmbedBuilder().setURL("https://mdfk.ethci.app/").setTitle(`image${index}.png`).setImage(`attachment://image${index}.png`));
        }
        interaction.editReply({ embeds: emb, files: temp });
    }
    catch (error) {
        interaction.editReply(`message: ${String(error)}`);
    }
};
const setBody = (interaction) => {
    return {
        prompt: interaction.options.get("prompt") ? interaction.options.get("prompt")?.value : "",
        width: interaction.options.get("width") ? interaction.options.get("width")?.value : 512,
        height: interaction.options.get("width") ? interaction.options.get("height")?.value : 512,
        negative_prompt: interaction.options.get("negative_prompt")?.value,
        seed: interaction.options.get("seed") ? interaction.options.get("seed")?.value : -1,
        subseed: interaction.options.get("subseed") ? interaction.options.get("subseed")?.value : undefined,
        subseed_strength: interaction.options.get("subseed_strength") ? interaction.options.get("subseed_strength")?.value : undefined,
        seed_resize_from_h: interaction.options.get("seed_resize_from_h") ? interaction.options.get("seed_resize_from_h")?.value : undefined,
        seed_resize_from_w: interaction.options.get("seed_resize_from_w") ? interaction.options.get("seed_resize_from_w")?.value : undefined,
        sampler_name: interaction.options.get("sampler_name") ? interaction.options.get("sampler_name")?.value : undefined,
        scheduler: interaction.options.get("scheduler") ? interaction.options.get("scheduler")?.value : undefined,
        batch_size: interaction.options.get("batch_size") ? interaction.options.get("batch_size")?.value : undefined,
        n_iter: interaction.options.get("n_iter") ? interaction.options.get("n_iter")?.value : undefined,
        steps: interaction.options.get("steps") ? interaction.options.get("steps")?.value : undefined,
        cfg_scale: interaction.options.get("cfg_scale") ? interaction.options.get("cfg_scale")?.value : 7
    };
};
const txt2img = async (interaction) => {
    await interaction.deferReply();
    const api = `${process.env.sdEndPoint}/sdapi/v1/txt2img`;
    log_1.logger.info(`${interaction.user.globalName}: ${JSON.stringify(setBody(interaction))}`);
    const resp = await (0, fetch_1.asyncPost)(api, setBody(interaction)).catch(error => {
        log_1.logger.error(`api: ${error}`);
    });
    formater(resp, interaction);
};
const info = {
    data: data,
    execute: txt2img
};
module.exports = info;
