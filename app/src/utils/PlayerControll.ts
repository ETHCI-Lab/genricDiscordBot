import { AudioResource,AudioPlayer,AudioPlayerStatus } from '@discordjs/voice';
import { logger } from './log';
import {audioMeta} from "../interfaces/audioMeta"


export class PlayerController{

    public musicList:Array<AudioResource<unknown>>;

    public player:AudioPlayer;

    public current:{
        resource:AudioResource<unknown> |undefined,
        index:number
    }

    constructor(player:AudioPlayer){
        this.musicList = [];
        this.player = player;
        this.current = {
            resource:undefined,
            index:-1,
        }
        player.on(AudioPlayerStatus.Idle,()=>{
            if (this.musicList.length!=0) {
                this.playNext()
            }
        })
    }

    pushMusic(res:AudioResource<unknown>){

        if (this.musicList.length!=0) {
            this.musicList.push(res)
        }else{

            this.musicList.push(res)

            this.current.index = 0
            this.playMusic()
        }
        
    }

    async playMusic(){
        this.current.resource = this.musicList[this.current.index]
    
        try {
            this.player.play(this.current.resource)
        } catch (error) {
            const meta:audioMeta = this.current.resource.metadata as audioMeta
            this.current.resource = await meta.getAudio()
            this.player.play(this.current.resource)
        }

        const meta:audioMeta = this.current.resource.metadata as audioMeta
        
        return meta
    }

    async playNext(): Promise<audioMeta> {

        if (this.current.index!=this.musicList.length-1) {

            this.current.index+=1;

        }else{
            this.current.index = 0;
        }

        return await this.playMusic()

    }

    async playPrev(): Promise<audioMeta> {

        if (this.current.index!=0) {

            this.current.index-=1;

        }else{
            this.current.index = this.musicList.length-1;
        }

        return await this.playMusic()
    }

    clear(){
        this.current = {
            resource:undefined,
            index:-1,
        }
    }

}