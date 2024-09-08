import path from "path";
import fs from "fs"
import { REST, Routes } from "discord.js";
import { logger } from "../utils/log";
import { CommandDic } from "../interfaces/CommandDic";
require('dotenv').config()

export const commandRegi = async (rest:REST):Promise<CommandDic> => {

    const foldersPath = path.join(__dirname, "..",'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    const commands = [];
    const commandDic:CommandDic = {}

    for (const folder of commandFolders) {
        // Grab all the command files from the commands directory you created earlier
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());

                commandDic[command.data.name] = {
                    data:command.data,
                    execute:command.execute
                }
                
            } else {
                logger.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
            }
        }
    }

    const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID as string),
        { body: commands },
    );

    //@ts-ignore
    logger.info(`Successfully reloaded ${data.length} application (/) commands.`)

    return commandDic;
}