import { Tool } from "ollama";

export interface toolInfo {
    id:string,
    info:Tool,
    excute:(args: { [key: string]: any }) => Promise<any>,
}