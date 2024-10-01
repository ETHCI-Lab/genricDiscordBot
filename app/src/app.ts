import { ActivityType, Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { commandRegi } from './init/commandsRegi';
import { logger } from './utils/log';
import { setEvent } from './init/setEvent';
import { setModel } from './utils/sd/setmodel';
import { Dic } from './interfaces/Dic';
import { CommandInfo } from './interfaces/CommandInfo';
import { StateManger } from './utils/StateManger';
import { loginDSM } from './init/loginDSM';
import { error } from 'jquery';
import { InitAudioPlayer } from './init/InitAudioPlayer';
import { getPyfileInfo } from './utils/music/getPyfileInfo';
import { setReply } from './init/setReply';
require('dotenv').config()

const main = async () => {

  const stateManger = new StateManger();

  await loginDSM({
    name: process.env.SynnologyDsmUserName as string,
    password: process.env.SynnologyDsmPassword as string
  })

  await setModel();

  InitAudioPlayer();

  const rest = new REST({ version: '10' }).setToken(process.env.BOTTOKEN as string);
  const client: Client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ] 
  })

  setReply(client);
  await StateManger.getOllamaController()?.initModelList()

  const commandDic: Dic<CommandInfo> = await commandRegi(rest);
  setEvent(client, commandDic);
  

  client.on('ready', () => {
    logger.info(`Logged in as ${client.user?.tag}!`);
    //@ts-ignore
    client.user.setActivity('顧小孩', {
      type: ActivityType.Custom,
      state:"😅 正在家裡顧小孩",
    });
  });

  client.on('error', (error: Error) => {
    logger.error(error)
  })

  client.login(process.env.BOTTOKEN as string);
}

main()