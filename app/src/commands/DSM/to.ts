import { CommandInteraction,SlashCommandBuilder, SlashCommandIntegerOption } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { StateManger } from "../../utils/StateManger";
import { audioMeta } from "../../interfaces/audioMeta";


require('dotenv').config()

const data = new SlashCommandBuilder().setName('tomusic').setDescription('切換音樂').addIntegerOption((option: SlashCommandIntegerOption) => option.setName('index').setDescription('第幾首歌').setRequired(true))


const toPy = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();
    const controller = StateManger.getPlayController()
    const index = interaction.options.get("index")
    if (index) {

        const target: number = index.value as number
        const meta:audioMeta | void = await controller?.to(target-1)

        if (meta) {
            await interaction.editReply(`切換至${meta?.name}`);
        }else{
            await interaction.editReply(`切換失敗`);
        }
    }
}

const info: CommandInfo = {
    data: data,
    execute: toPy
}

module.exports = info;