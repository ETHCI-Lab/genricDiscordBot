import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { commandRegi } from './init/commandsRegi';
import { logger } from './utils/log';
import { setEvent } from './init/setEvent';
import { CommandDic } from './interfaces/CommandDic';
import { getRandomPy } from './utils/getRandomPy';
require('dotenv').config()

const main = async () => {

  const rest = new REST({ version: '10' }).setToken(process.env.BOTTOKEN as string);
  const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] })

  const commandDic: CommandDic = await commandRegi(rest);
  setEvent(client, commandDic);

  client.on('ready', () => {
    logger.info(`Logged in as ${client.user?.tag}!`);
    logger.info(getRandomPy())
  });

  client.login(process.env.BOTTOKEN as string);
}

main()