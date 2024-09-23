import { CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface CommandInfo{
    data:typeof SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    execute:(interaction: CommandInteraction) => Promise<void>;
}