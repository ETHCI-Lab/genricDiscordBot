"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commandsRegi_1 = require("./init/commandsRegi");
const log_1 = require("./utils/log");
const setEvent_1 = require("./init/setEvent");
require('dotenv').config();
const main = async () => {
    const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.BOTTOKEN);
    const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
    const commandDic = await (0, commandsRegi_1.commandRegi)(rest);
    (0, setEvent_1.setEvent)(client, commandDic);
    // await setModel()
    client.on('ready', () => {
        log_1.logger.info(`Logged in as ${client.user?.tag}!`);
    });
    client.login(process.env.BOTTOKEN);
};
main();
