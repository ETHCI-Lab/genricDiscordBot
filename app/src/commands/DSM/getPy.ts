import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, ComponentType, EmbedBuilder, Interaction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/embed/getRandomPy";
import { getPyfileInfo } from "../../utils/music/getPyfileInfo";
import { loginDSM } from "../../init/loginDSM";
import { DSMFiles } from "../../interfaces/DSMFiles";
import { DSMresp } from "../../interfaces/DSMresp";
import { logger } from "../../utils/log";
import { StateManger } from "../../utils/StateManger";
import { chunkArray } from "../../utils/ChunkArray";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('pymusic').setDescription('查培宇音樂')


const formater = async (info: DSMresp<DSMFiles>, interaction: CommandInteraction) => {

    let index = 0

    const list = chunkArray(info.data.files, 5);

    const args: Array<Array<{ name: string, value: any, inline: boolean }>> = []

    list.forEach(sublist => {

        let temp: Array<{ name: string, value: any, inline: boolean }> = []

        sublist.forEach(file => {
            temp.push({
                name: `${info.data.files.indexOf(file)+1}: ${file.name}`,
                value: `大小: ${Math.round(file.additional.size/1048576)} MB`,
                inline: false
            })
        })

        args.push(temp)

    })

    const createButtonRow = () => {
        const nextPageBtn = new ButtonBuilder()
            .setCustomId('nextPage')
            .setLabel('Next Page')
            .setStyle(ButtonStyle.Secondary);

        const prvPageBtn = new ButtonBuilder()
            .setCustomId('prvPage')
            .setLabel('Previous Page')
            .setStyle(ButtonStyle.Secondary);

        return new ActionRowBuilder().addComponents(prvPageBtn, nextPageBtn);
    };

    const updateResponse = async () => {
        const resp = new EmbedBuilder()
            .setColor(0x212121)
            .setTitle(`培宇音樂表 (${index + 1}/${list.length})`)
            .setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
            .setThumbnail(getRandomPy())
            .setTimestamp()
            .addFields(args[index]);

        return await interaction.editReply({
            embeds: [resp],
            components: [createButtonRow()],
        });
    };

    const response = await updateResponse()

    // 收集按鈕互動
    const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
    const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 3_600_000 });

    collector.on('collect', async (i) => {

        // 確保回應用戶的交互
        await i.deferUpdate();

        if (i.customId === 'nextPage') {
            index = (index + 1) % list.length;
        } else if (i.customId === 'prvPage') {
            index = (index - 1 + list.length) % list.length;
        }

        await updateResponse();
    });

}

const getpy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();

    if (StateManger.getDSMSid() != undefined && StateManger.getDSMCookie() != undefined) {

        const musiclist: Array<{ name: string, value: string }> = []
        const list = await getPyfileInfo(StateManger.getDSMSid() as string, StateManger.getDSMCookie() as string,"PeiYu Cheng")

        list.data.files.forEach(file => {
            musiclist.push({
                name: file.name,
                value: file.name
            })
        })

        formater(list, interaction)

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



// "time": {
//     "atime": 1726673928,
//     "crtime": 1718905860,
//     "ctime": 1718905865,
//     "mtime": 1718905794
// },