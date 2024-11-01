import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, CacheType, ChatInputCommandInteraction, CommandInteraction, ComponentType, EmbedBuilder, Interaction, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, VoiceChannel } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/embed/getRandomPy";
import { logger } from "../../utils/log";
import { StateManger } from "../../utils/StateManger";
import { chunkArray } from "../../utils/ChunkArray";
import { audioMeta } from "../../interfaces/audioMeta";
import { getPyAudio } from "../../utils/music/getPyAudio";
import { getMusics } from "../../utils/music/getMusics";
import { createButtonRow } from "../../utils/embed/pageButton";
import { checkConnection } from "../../utils/music/checkConnection";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('selectmusic').setDescription('選擇培宇音樂')
const controller = StateManger.getPlayController()
let index: number = 0;
let chunkCached: { name: string; path: string; }[][] = []

const listCache = async (): Promise<{ name: string; path: string; }[][] | undefined> => {
    if (controller && controller.currentArthor) {
        if (controller.musicDic[controller.currentArthor.path]) {
            return chunkArray(controller.musicDic[controller.currentArthor.path], 5)
        } else {
            const list = await getMusics(controller.currentArthor.path)
            controller.musicDic[controller.currentArthor.path] = list
            return chunkArray(list, 5)
        }
    } else {
        return undefined
    }
}

const getCurrentList = () => {
    const controller = StateManger.getPlayController()
    const currentList = controller?.musicQueue
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

const genAuthorSelector = (): ActionRowBuilder<AnyComponentBuilder> => {
    const list: Array<StringSelectMenuOptionBuilder> = []

    controller?.authorQueue.forEach((author) => {
        const temp = new StringSelectMenuOptionBuilder()
            .setLabel(author.name)
            .setDescription(author.additional.size > 1024 ? `${Math.round(author.additional.size / 1024 * 100) / 100} GB` : `${author.additional.size} MB`)
            .setValue(author.path)

        list.push(temp)
    })

    const select = new StringSelectMenuBuilder()
        .setCustomId('author')
        .setPlaceholder('切換音樂人')
        .addOptions(list)
    return new ActionRowBuilder().addComponents(select);
}

const genmusicList = async (index: number, update: boolean) => {
    if (update) {
        const temp = await listCache()
        if (temp) {
            chunkCached = temp
        }
    }

    const musicBtnsrow: Array<ButtonBuilder> = []

    if (chunkCached[index]) {
        chunkCached[index].forEach((file) => {
            musicBtnsrow.push(
                new ButtonBuilder()
                    .setCustomId(file.name)
                    .setLabel(file.name)
                    .setStyle(ButtonStyle.Secondary)
            )
        })
    } else {
        musicBtnsrow.push(
            new ButtonBuilder()
                .setCustomId("當前音樂人沒有資料")
                .setLabel("當前音樂人沒有資料")
                .setStyle(ButtonStyle.Secondary)
        )
    }

    return new ActionRowBuilder().addComponents(musicBtnsrow);
}

const updateResponse = async (interaction: CommandInteraction,update:boolean) => {
    if (controller) {
        const resp = new EmbedBuilder()
            .setColor(0x212121)
            .setTitle('當前撥放器音樂表')
            .setAuthor({ name: 'CWL機器人', iconURL: getRandomPy() })
            .setThumbnail(getRandomPy())
            .setTimestamp()
            .setFields(
                { name: "當前音樂人", value: controller.currentArthor ? controller.currentArthor.name : "未選擇", inline: false },
                { name: "音樂表", value: getCurrentList() == "" ? "當前列表空白" : getCurrentList(), inline: true }
            )


        return await interaction.editReply({
            embeds: [resp],
            //@ts-ignore
            components: [genAuthorSelector(), await genmusicList(index,update),createButtonRow()],
        });
    }else{
        return await interaction.editReply("500: server error");
    }
}

const playPy = async (interaction: CommandInteraction,target: string, author: string) => {

    const player = StateManger.getPlayer()
    const controller = StateManger.getPlayController()

    await checkConnection(interaction)

    if (StateManger.getDSMSid() != undefined && StateManger.getDSMCookie() != undefined) {
        const path = author.replace("/volume1","")
        const resource = await getPyAudio(encodeURI(author.startsWith("/volume")?path:author), target)
        if (player && resource) {
            controller?.pushMusic(resource);
        }
    }
}

const render = async (interaction: CommandInteraction) => {
    if (controller) {
        let update = false
        const response = await updateResponse(interaction,update)

        // 收集按鈕互動
        const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
        const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 3_600_000 });
    
        collector.on('collect', async (i) => {
    
            // 確保回應用戶的交互
            await i.deferUpdate();
    
            try {
                if (i.customId === 'author') {
    
                    //@ts-ignore
                    const interaction: StringSelectMenuInteraction<CacheType> = i
                    controller.authorQueue.forEach(author=>{
                        if (author.path == interaction.values[0]) {
                            controller.currentArthor = author
                            index = 0
                        }
                    })
                    update = true
    
                } else if (i.customId === 'nextPage') {
    
                    index = (index + 1) % chunkCached.length;
    
                } else if (i.customId === 'prvPage') {
    
                    index = (index - 1 + chunkCached.length) % chunkCached.length;
    
                } else {
                    if (i.customId != "當前音樂人沒有資料") {
                        if (controller.currentArthor) {
                            chunkCached[index].forEach(async (music)=>{
                                if (music.name == i.customId) {
                                    await playPy(interaction,i.customId, music.path)   
                                }
                            })
                            
                        }
                    }
                }

                await updateResponse(interaction,update);
            } catch (error) {
                logger.info(`select: ${error}`)
            }
        });
    }
}

const getpy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();

    if (StateManger.getDSMSid() != undefined && StateManger.getDSMCookie() != undefined) {
        await render(interaction)
    } else {
        await interaction.editReply("登入失敗");
    }
}

const info: CommandInfo = {
    data: data,
    execute: getpy
}

module.exports = info;