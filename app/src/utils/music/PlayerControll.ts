import { AudioResource,AudioPlayer,AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior } from '@discordjs/voice';
import { logger } from '../log';
import {audioMeta} from "../../interfaces/audioMeta"
import { asyncPost } from '../fetch';
import { DSMFile } from '../../interfaces/DSMFile';
import { StateManger } from '../StateManger';
import { getPyfileInfo } from './getPyfileInfo';
import { DSMFiles } from '../../interfaces/DSMFiles';
import { DSMresp } from '../../interfaces/DSMresp';
import { appendFile, appendFileSync } from 'fs';
import { Dic } from '../../interfaces/Dic';
import { getMusics } from './getMusics';


export class PlayerController{

    public musicQueue:Array<AudioResource<unknown>>;

    public musicList:Dic<Array<{name:string,path:string}>>;


    public player:AudioPlayer;

    public current:{
        resource:AudioResource<unknown> |undefined,
        index:number
    }

    constructor(player:AudioPlayer){
        this.musicQueue = [];
        this.musicList = {}
        this.player = player;
        this.current = {
            resource:undefined,
            index:-1,
        }
        player.on(AudioPlayerStatus.Idle,()=>{
            if (this.musicQueue.length!=0) {
                this.playNext()
            }
        })
    }

    pushMusic(res:AudioResource<unknown>){

        if (this.musicQueue.length!=0) {
            this.musicQueue.push(res)
        }else{

            this.musicQueue.push(res)

            this.current.index = 0
            this.playMusic()
        }
    }

    insertMusic(res:AudioResource<unknown>){
        this.musicQueue.splice(this.current.index+1, 0, res);
    }

    insertMusicAt(res:AudioResource<unknown>,index:number){
        this.musicQueue.splice(index, 0, res);
    }

    async playMusic(){
        this.current.resource = this.musicQueue[this.current.index]
    
        try {
            this.player.play(this.current.resource)
        } catch (error) {
            const meta:audioMeta = this.current.resource.metadata as audioMeta
            this.current.resource = await meta.getAudio()
            try {
                this.player.play(this.current.resource)
            } catch (error) {
                logger.error(`play music: ${error}`)
                this.playNext()
            }
        }

        const meta:audioMeta = this.current.resource.metadata as audioMeta
        
        return meta
    }

    async playNext(): Promise<audioMeta> {

        if (this.current.index!=this.musicQueue.length-1) {

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
            this.current.index = this.musicQueue.length-1;
        }

        return await this.playMusic()
    }

    async to(index:number): Promise<audioMeta | void> {
        if (index>-1 && index<=this.musicQueue.length) {
            this.current.index = index;
            return await this.playMusic()
        }
    }

    async getSinger(){
        
        const data:DSMresp<DSMFiles>|undefined = await getPyfileInfo() ;

        if (data) {
            await Promise.all(data.data.files.map(async (dir)=>{
                const list = await getMusics(dir.path)
                this.musicList[dir.path] = list
            }))

        } 

        appendFileSync("../test3.json",JSON.stringify(this.musicList))
    }

    clear(){

        this.musicQueue = [];

        this.current = {
            resource:undefined,
            index:-1,
        }

    }

}