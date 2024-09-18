import { ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/getRandomPy";
import { getPyfileInfo } from "../../utils/getPyfileInfo";
import { loginDSM } from "../../init/loginDSM";
import { DSMFiles } from "../../interfaces/DSMFiles";
import { DSMresp } from "../../interfaces/DSMresp";
import { logger } from "../../utils/log";
import { StateManger } from "../../utils/StateManger";
import { chunkArray } from "../../utils/ChunkArray";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('pymusic').setDescription('查培宇音樂')


const formater = (info: DSMresp<DSMFiles>): EmbedBuilder => {

    let str = ""

    const list =  chunkArray(info.data.files, 25);

    for (let index = 0; index < info.data.files.length; index++) {
        const file = info.data.files[index];
        str += `${index + 1}: ${file.name}\n`
    }

    const resp = new EmbedBuilder()
        .setColor(0x212121)
        .setTitle('培宇音樂表')
        .setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
        .setThumbnail(getRandomPy())
        .setTimestamp()

    if (info.success) {
        resp.setFields(
            { name: "音樂表", value: str, inline: true }
        )

    } else {
        resp.setDescription("讀取失敗")
        logger.error(JSON.stringify(info))
    }

    return resp
}

const getpy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();

    if (StateManger.getDSMSid() != undefined && StateManger.getDSMCookie() != undefined) {

        const musiclist: Array<{ name: string, value: string }> = []
        const list = await getPyfileInfo(StateManger.getDSMSid() as string, StateManger.getDSMCookie() as string)

        list.data.files.forEach(file => {
            musiclist.push({
                name: file.name,
                value: file.name
            })
        })

        await interaction.editReply({ embeds: [formater(list)] });

    } else {

        await interaction.editReply("登入失敗");

        await loginDSM({
            name: process.env.SynnologyDsmUserName as string,
            password: process.env.SynnologyDsmPassword as string
        });

    }
}

const info: CommandInfo = {
    data: data,
    execute: getpy
}

module.exports = info;
