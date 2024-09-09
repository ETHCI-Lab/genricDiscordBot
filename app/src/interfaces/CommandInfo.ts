import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface CommandInfo{
    data:typeof SlashCommandBuilder,
    execute:(interaction: CommandInteraction) => Promise<void>;
}