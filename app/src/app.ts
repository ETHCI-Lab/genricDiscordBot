import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { commandRegi } from './init/commandsRegi';
import { logger } from './utils/log';
import { setEvent } from './init/setEvent';
import { setModel } from './utils/setmodel';
import { Dic } from './interfaces/Dic';
import { CommandInfo } from './interfaces/CommandInfo';
import { StateManger } from './utils/StateManger';
import { loginDSM } from './init/loginDSM';
import { error } from 'jquery';
import { InitAudioPlayer } from './init/InitAudioPlayer';
import { getPyfileInfo } from './utils/getPyfileInfo';
require('dotenv').config()

const main = async () => {

  const stateManger = new StateManger();

  await loginDSM({
    name: process.env.SynnologyDsmUserName as string,
    password: process.env.SynnologyDsmPassword as string
  })

  const musiclist:Array<{ name: string, value: string }> = []

  getPyfileInfo(StateManger.getDSMSid() as string,StateManger.getDSMCookie() as string).then(res=>{
    res.data.files.forEach(file=>{
      musiclist.push({
        name: file.name,
        value: file.name
      })
    })
  })


  await setModel();

  InitAudioPlayer();

  const rest = new REST({ version: '10' }).setToken(process.env.BOTTOKEN as string);
  const client: Client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildVoiceStates] })

  const commandDic: Dic<CommandInfo> = await commandRegi(rest);
  setEvent(client, commandDic);

  client.on('ready', () => {
    logger.info(`Logged in as ${client.user?.tag}!`);
  });

  client.on('error',(error:Error)=>{
    logger.error(error)
  })

  client.login(process.env.BOTTOKEN as string);
}

main()