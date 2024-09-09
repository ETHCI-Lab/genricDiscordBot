"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEvent = void 0;
const discord_js_1 = require("discord.js");
const log_1 = require("../utils/log");
const setEvent = (client, command) => {
    client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const target = command[interaction.commandName];
        if (!target) {
            log_1.logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            await target.execute(interaction);
        }
        catch (error) {
            log_1.logger.error(error);
            const temp = {
                code: "501",
                message: "伺服器錯誤",
                body: JSON.stringify(error)
            };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: JSON.stringify(temp), ephemeral: true });
            }
            else {
                await interaction.reply({ content: JSON.stringify(temp), ephemeral: true });
            }
        }
    });
};
exports.setEvent = setEvent;
