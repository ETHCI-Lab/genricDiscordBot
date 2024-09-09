"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandRegi = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const log_1 = require("../utils/log");
require('dotenv').config();
const commandRegi = async (rest) => {
    const foldersPath = path_1.default.join(__dirname, "..", 'commands');
    const commandFolders = fs_1.default.readdirSync(foldersPath);
    const commands = [];
    const commandDic = {};
    for (const folder of commandFolders) {
        // Grab all the command files from the commands directory you created earlier
        const commandsPath = path_1.default.join(foldersPath, folder);
        const commandFiles = fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const filePath = path_1.default.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                commandDic[command.data.name] = {
                    data: command.data,
                    execute: command.execute
                };
            }
            else {
                log_1.logger.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    const data = await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.Guild_ID), { body: commands });
    //@ts-ignore
    log_1.logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
    return commandDic;
};
exports.commandRegi = commandRegi;
