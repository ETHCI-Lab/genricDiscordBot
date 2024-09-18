import { AudioPlayer,createAudioPlayer } from '@discordjs/voice';
import { PlayerController } from './PlayerControll';

export class StateManger{

    static info:{
        modelOption:Array<{ name: string, value: string }>,
        DSMInfo:{
            DSMsid:string|undefined,
            DSMCookie:string|undefined
        },
        player:AudioPlayer | undefined,
        playController:PlayerController | undefined
    }

    constructor(){
        StateManger.info = {
            modelOption:[],
            DSMInfo:{
                DSMsid: undefined,
                DSMCookie: undefined
            },
            player:undefined,
            playController:undefined
        }
    }

    static setModelOption(payload:Array<{ name: string, value: string }>){
        StateManger.info.modelOption = payload
    }

    static setDSMsid(payload:string){
        StateManger.info.DSMInfo.DSMsid = payload
    }

    static getDSMSid(){
        return StateManger.info.DSMInfo.DSMsid
    }

    static setDSMCookie(payload:string){
        StateManger.info.DSMInfo.DSMCookie = payload
    }

    static getDSMCookie(){
        return StateManger.info.DSMInfo.DSMCookie
    }

    static getModelOption(){
        return StateManger.info.modelOption
    }

    static setPlayer(payload:AudioPlayer){
        StateManger.info.player = payload
        this.info.playController = new PlayerController(StateManger.info.player)
    }

    static getPlayer(){
        return StateManger.info.player
    }

    static getPlayController(){
        return StateManger.info.playController
    }
}