import { sdPrompt } from "./sdPrompt";

export interface sdResp{
    images:string[],
    parameters:sdPrompt
    info:string
}