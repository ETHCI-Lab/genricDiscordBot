import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const createButtonRow = (): ActionRowBuilder => {
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