import { CommandInteraction, SlashCommandStringOption, VoiceChannel,SlashCommandBooleanOption, AttachmentBuilder,SlashCommandBuilder, APIApplicationCommandOptionChoice, EmbedBuilder, RestOrArray, APIEmbedField } from "discord.js";
import { CommandInfo } from "../../interfaces/CommandInfo";
import { StateManger } from "../../utils/StateManger";  
import { getToolChoice } from "../../utils/ollama/getToolChoice";
import { Tool } from "ollama";
import { Dic } from "../../interfaces/Dic";
import { getRandomPy } from "../../utils/embed/getRandomPy";
require('dotenv').config()

const data = new SlashCommandBuilder().setName('chat').setDescription('跟培宇聊天')
    .addStringOption((option: SlashCommandStringOption) => option.setName('prompt').setDescription('prompt').setRequired(true))
    .addBooleanOption((option: SlashCommandBooleanOption) => option.setName('stream').setDescription('stream').setRequired(true))

const choice = getToolChoice()

for (let index = 0; index < 23; index++) {
    data.addStringOption((option: SlashCommandStringOption) => option.setName(`tool${index+1}`).setDescription(`選擇第${index+1}個工具`).setRequired(false).addChoices(choice))
}

const inputTotools = (interaction: CommandInteraction,toolInfoDic:Dic<Tool>|undefined):Tool[]=>{
    if (toolInfoDic) {
        const toolUsed:Tool[] = []
        for (let index = 0; index < 23; index++) {
            if (toolInfoDic[interaction.options.get(`tool${index+1}`)?.value as string]) {
                toolUsed.push(toolInfoDic[interaction.options.get(`tool${index+1}`)?.value as string])   
            }
        }
        return toolUsed
    }else{
        return []
    }
}

const chat = async (interaction: CommandInteraction) => {

    /**
     * 延遲回應
     */
    await interaction.deferReply();

    const controller = StateManger.getOllamaController()
    const tools = inputTotools(interaction,controller?.getToolInfoDic())

    if (controller) {
        if (interaction.options.get("stream")?.value) {
            let resp = ""
            const llamaResp = await controller.sendChatStream(interaction.options.get("prompt")?.value as string,interaction.channel?.id as string);
            if (llamaResp) {
                for await (const part of llamaResp) {
                    resp+=part.message.content
                    await interaction.editReply(resp);
                }
            }else{
                await interaction.editReply("not init");
            }

        }else{
            const llamaResp = await controller.sendChat(
                interaction.options.get("prompt")?.value as string,
                interaction.channel?.id as string,
                tools
            );
            if (llamaResp) {
                const tools:Array<EmbedBuilder> = []

                llamaResp.toolResp.forEach((tool)=>{
                    let args: RestOrArray<APIEmbedField> = []

                    Object.keys(tool.function.arguments).forEach(key=>{
                        args.push({
                            name: key,
                            value: JSON.stringify(tool.function.arguments[key])
                        })
                    })

                    let temp = new EmbedBuilder()
                    .setColor(0x212121)
                    .setTitle(tool.function.name)
                    .setAuthor({ name: 'PYC機器人', iconURL: getRandomPy() })
                    .addFields(
                        args
                    )
                    .setTimestamp()

                    tools.push(temp)
                })

                if (llamaResp.img) {

                    await interaction.editReply({
                        content:llamaResp.message.content,
                        files:[new AttachmentBuilder(Buffer.from(llamaResp.img.images[0], 'base64'), { name: `image0.png` })],
                        embeds:tools
                    });
                }else{
                    await interaction.editReply({
                        content:llamaResp.message.content,
                        embeds:tools
                    });
                }
                
            }else{
                await interaction.editReply("not init");
            }
        }

    } else {
        await interaction.editReply("not init");
    }
}

const info: CommandInfo = {
    data: data,
    execute: chat
}


module.exports = info;
