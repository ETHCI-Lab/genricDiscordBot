import {  CommandInteraction, EmbedBuilder,  } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/getRandomPy";
import { AudioResource } from '@discordjs/voice';
import { StateManger } from "../../utils/StateManger";
import { audioMeta } from "../../interfaces/audioMeta";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('currentlist').setDescription('查當前列表')


const formater = (info:  AudioResource<unknown>[] | undefined):EmbedBuilder => {

    let str = ""

    const currentSong = StateManger.getPlayController()?.current

    if (info!= undefined) {
        for (let index = 0; index < info.length; index++) {
            const meta:audioMeta = info[index].metadata as audioMeta
            const iscurrent =  currentSong?.resource == info[index]
            str += `${iscurrent?">":""}${index + 1}: ${meta.name}\n`
        }
    }

    const resp = new EmbedBuilder()
        .setColor(0x212121)
        .setTitle('當前撥放器音樂表')
        .setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
        .setThumbnail(getRandomPy())
        .setTimestamp()
        resp.setFields(
            { name: "音樂表", value: str == ""?"當前列表空白":str, inline: true }
        )

    return resp
}

const getpy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();
    const controller = StateManger.getPlayController()
    const list = controller?.musicList
    await interaction.editReply({ embeds: [formater(list)] });
}

const info: CommandInfo = {
    data: data,
    execute: getpy
}

module.exports = info;
