import { createAudioPlayer,NoSubscriberBehavior } from '@discordjs/voice';
import { StateManger } from '../utils/StateManger';
import { error } from 'jquery';
import { logger } from '../utils/log';

export const InitAudioPlayer = ()=>{

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    })
    
    player.on("error",(error)=>{
        logger.error(`audio: ${error}`)
    })

    StateManger.setPlayer(player)
}