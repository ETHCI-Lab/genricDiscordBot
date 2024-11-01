import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, ComponentType, EmbedBuilder, Interaction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { getRandomPy } from "../../utils/embed/getRandomPy";
import { StateManger } from "../../utils/StateManger";
import { chunkArray } from "../../utils/ChunkArray";
import { DSMFile } from "../../interfaces/DSMFile";

const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

const data = new SlashCommandBuilder().setName('pymusic').setDescription('添加/查詢 當前加載音樂目錄')

const genAuthorSelector = (list: DSMFile[], index: number): ActionRowBuilder<AnyComponentBuilder> => {
    const auhorList: Array<StringSelectMenuOptionBuilder> = []

    list.forEach((file) => {
        const temp = new StringSelectMenuOptionBuilder()
            .setLabel(`${file.additional.owner.user}: ${file.name}`)
            .setDescription(file.additional.size > 1024 ? `${Math.round(file.additional.size / 1024 * 100) / 100} GB` : `${file.additional.size} MB`)
            .setValue(file.path)

        auhorList.push(temp)
    })

    const select = new StringSelectMenuBuilder()
        .setCustomId('author')
        .setPlaceholder('添加目錄')
        .addOptions(auhorList)
    return new ActionRowBuilder().addComponents(select);
}

const formater = async (info: DSMFile[], interaction: CommandInteraction) => {

    let index = 0;

    const list = chunkArray(info, 5);
    const controller = StateManger.getPlayController();

    const genList =()=>{
        const authorQueue = controller?.authorQueue

        const args: Array<{ name: string, value: any, inline: boolean }> = []
    
        if (authorQueue) {
            authorQueue.forEach(author => {
                args.push({
                    name: `${author.additional.owner.user}: ${author.name}`,
                    value: author.additional.size > 1024 ? `${Math.round(author.additional.size / 1024 * 100) / 100} GB` : `${author.additional.size} MB`,
                    inline: false
                })
            })
        }

        return args
    }

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
            .setAuthor({ name: 'PYC機器人', iconURL: getRandomPy() })
            .setDescription(`當前加載資料夾: ${controller?.authorQueue ? controller?.authorQueue.length : 0} 個`)
            .setThumbnail(getRandomPy())
            .setTimestamp()
            .addFields(genList());

        return await interaction.editReply({
            embeds: [resp],
            //@ts-ignore
            components: [genAuthorSelector(list[index]), createButtonRow()],
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
        } else if (i.customId === 'author') {
            //@ts-ignore
            const interaction: StringSelectMenuInteraction<CacheType> = i
            list[index].forEach(author=>{
                if (author.path == interaction.values[0]) {
                    controller?.authorQueue?.push(author)
                }
            })
            
        }

        await updateResponse();
    });

}

const getpy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();

    const list = StateManger.getPlayController()?.authorList

    if (list) {
        formater(list, interaction)
    }

}

const info: CommandInfo = {
    data: data,
    execute: getpy
}

module.exports = info;
