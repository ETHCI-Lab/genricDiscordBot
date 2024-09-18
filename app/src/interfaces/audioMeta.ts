import { createAudioResource, AudioResource } from '@discordjs/voice';
export interface audioMeta{
    name: string;
    getAudio: () => Promise<AudioResource<unknown>>;
}