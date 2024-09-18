import { Readable, ReadableOptions } from 'node:stream';
import { createAudioResource, AudioResource } from '@discordjs/voice';
import { StateManger } from "./StateManger";
import fetch from "node-fetch";

export const getPyAudio = async (path:string,name:string):Promise<AudioResource<unknown>>=>{
    const url = `${process.env.SynnologyDsmEndPoint}/webapi/entry.cgi/.mp3?method=transcode&format=mp3&path=${path}&position=0&api=SYNO.AudioPlayer.Stream&version=2`
    const resp = await fetch(url,{
        headers:{
            Cookie:StateManger.getDSMCookie() as string
        }
    })
    
    const buffer = await resp.buffer();

    const readableStream = new Readable();
    readableStream.push(buffer);

    /*
     * stop pipe
     */
    readableStream.push(null)

    return createAudioResource(readableStream,{
        metadata:{
            name:name,
            getAudio:async ()=>{
                return await getPyAudio(path,name)
            }
        }
    })
}