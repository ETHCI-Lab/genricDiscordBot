import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, ChatInputCommandInteraction, CommandInteraction, ComponentType, EmbedBuilder, Interaction, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/getRandomPy";
import { getPyfileInfo } from "../../utils/getPyfileInfo";
import { loginDSM } from "../../init/loginDSM";
import { DSMFiles } from "../../interfaces/DSMFiles";
import { DSMresp } from "../../interfaces/DSMresp";
import { logger } from "../../utils/log";
import { StateManger } from "../../utils/StateManger";
import { chunkArray } from "../../utils/ChunkArray";
import { audioMeta } from "../../interfaces/audioMeta";
import { getPyAudio } from "../../utils/getPyAudio";
import { joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";

type list = {
    additional: {
        description: {};
        indexed: boolean;
        mount_point_type: string;
        owner: {
            gid: number;
            group: string;
            uid: number;
            user: string;
        };
        perm: {
            acl: {
                append: boolean;
                del: boolean;
                exec: boolean;
                read: boolean;
                write: boolean;
            };
            is_acl_mode: boolean;
            posix: number;
        };
        real_path: string;
        size: number;
        time: {
            atime: number;
            crtime: number;
            ctime: number;
            mtime: number;
        };
        type: string;
    };
    isdir: boolean;
    name: string;
    path: string;
}[][]

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('selectmusic').setDescription('選擇培宇音樂').addStringOption((option: SlashCommandStringOption) => option.setName('author').setDescription('音樂人').setRequired(true).addChoices(
    { name: 'peiyu', value: 'PeiYu Cheng' },
    { name: 'jay chou', value: 'jay chou' },
    { name: 'yoasobi', value: 'yoasobi' },
    { name: '冷門', value: '冷門' },
    { name: 'anime', value: 'anime' },
    { name: 'Riot Music', value: 'Riot Music' },
    { name: 'Lisa', value: 'Lisa' },
    { name: '鬍子男', value: '鬍子男' },
))


const genList = async (interaction: CommandInteraction, choosedAuthor: string) => {

    let author = interaction.options.get("author")?.value == choosedAuthor ? interaction.options.get("author")?.value as string : choosedAuthor

    const resp: DSMresp<DSMFiles> = await getPyfileInfo(StateManger.getDSMSid() as string, StateManger.getDSMCookie() as string, author)

    return chunkArray(resp.data.files, 5)
}


const playPy = async (interaction: CommandInteraction, target: string,author:string) => {

    const player = StateManger.getPlayer()
    const controller = StateManger.getPlayController()

    if (StateManger.getDSMSid() != undefined && StateManger.getDSMCookie() != undefined) {
        //@ts-ignore
        const voiceChannel: VoiceChannel = interaction.member.voice.channel
        if (voiceChannel && interaction.guild) {

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId as string,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })

            connection.on("error", (error) => {
                logger.error(error)
            })

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                logger.info("Disconnected ")
                controller?.clear()
            })

            if (controller?.musicList.length == 0) {
                player?.stop()
            }

            logger.info(`/ETHCI/無損音檔/${author}/${target}`)

            const resource = await getPyAudio(encodeURI(`/ETHCI/無損音檔/${author}/${target}`), target)

            if (player) {
                connection.subscribe(player);
                controller?.pushMusic(resource);
            }
        }

    }
}

const getCurrentList = () => {
    const controller = StateManger.getPlayController()
    const currentList = controller?.musicList
    const currentSong = controller?.current

    let str = ""


    if (currentList != undefined) {
        for (let index = 0; index < currentList.length; index++) {
            const meta: audioMeta = currentList[index].metadata as audioMeta
            const iscurrent = currentSong?.resource == currentList[index]
            str += `${iscurrent ? ">" : ""}${index + 1}: ${meta.name}\n`
        }
    }

    return str
}


const formater = async ( interaction: CommandInteraction) => {

    let index = 0

    let author = interaction.options.get("author")?.value as string

    const genmusicList = (list:list): ActionRowBuilder => {

        const musicBtnsrow: Array<ButtonBuilder> = []

        if (list[index]) {
            list[index].forEach((file) => {
                musicBtnsrow.push(
                    new ButtonBuilder()
                        .setCustomId(file.name)
                        .setLabel(file.name)
                        .setStyle(ButtonStyle.Secondary)
                )
            })
        }else{
            musicBtnsrow.push(
                new ButtonBuilder()
                    .setCustomId("當前音樂人沒有資料")
                    .setLabel("當前音樂人沒有資料")
                    .setStyle(ButtonStyle.Secondary)
            )
        }

        return new ActionRowBuilder().addComponents(musicBtnsrow);
    }

    const genAuthorSelector = () => {
        const select = new StringSelectMenuBuilder()
            .setCustomId('author')
            .setPlaceholder('切換音樂人')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('鄭培宇')
                    .setDescription('鄭培宇')
                    .setValue('peiyu'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('周杰倫')
                    .setDescription('周杰倫')
                    .setValue('jay chou'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('yoasobi')
                    .setDescription('yoasobi')
                    .setValue('yoasobi'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('冷門')
                    .setDescription('冷門')
                    .setValue('冷門'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('anime')
                    .setDescription('anime')
                    .setValue('anime'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Riot Music')
                    .setDescription('Riot Music')
                    .setValue('Riot Music'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Lisa')
                    .setDescription('Lisa')
                    .setValue('Lisa'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('鬍子男')
                    .setDescription('鬍子男')
                    .setValue('鬍子男'),
            )
        return new ActionRowBuilder().addComponents(select);
    }


    const createButtonRow = (): ActionRowBuilder => {
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

    const updateResponse = async (list:list) => {

        const resp = new EmbedBuilder()
            .setColor(0x212121)
            .setTitle('當前撥放器音樂表')
            .setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
            .setThumbnail(getRandomPy())
            .setTimestamp()
            .setFields(
                { name: "當前音樂人", value: author, inline: false },
                { name: "音樂表", value: getCurrentList() == "" ? "當前列表空白" : getCurrentList(), inline: true }
            )


        return await interaction.editReply({
            embeds: [resp],
            components: [genAuthorSelector(), genmusicList(list), createButtonRow()],
        });
    };

    const list = await genList(interaction, author)

    const response = await updateResponse(list)

    // 收集按鈕互動
    const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
    const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 3_600_000 });

    collector.on('collect', async (i) => {

        // 確保回應用戶的交互
        await i.deferUpdate();

        let list

        if (i.customId === 'author') {

            //@ts-ignore
            const interaction: StringSelectMenuInteraction<CacheType> = i
            author = interaction.values[0]

        } else if (i.customId === 'nextPage') {

            list = await genList(interaction, author)

            index = (index + 1) % list.length;

        } else if (i.customId === 'prvPage') {

            list = await genList(interaction, author)

            index = (index - 1 + list.length) % list.length;

        } else {
            await playPy(interaction, i.customId,author)
        }

        await updateResponse(await genList(interaction, author));
    });

}

const getpy = async (interaction: CommandInteraction) => {

        /**
         * 延遲回應
         */
        await interaction.deferReply();

    if (StateManger.getDSMSid() != undefined && StateManger.getDSMCookie() != undefined) {

       await formater(interaction)

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