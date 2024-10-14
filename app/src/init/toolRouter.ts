import { toolInfo } from "../interfaces/toolInfo";
import { getAllSession, getAllSessionInfo } from "../utils/ollama/tools/getAllSession";
import { txt2img, txt2imgInfo } from "../utils/ollama/tools/txt2img";
import { webPageReader, webPageReaderInfo } from "../utils/ollama/tools/webReader";

export const toolRoutes:Array<toolInfo> = [
    {
        id:'txt2img',
        info:txt2imgInfo,
        excute:txt2img
    },
    {
        id:'getAllSession',
        info:getAllSessionInfo,
        excute:getAllSession
    },
    {
        id:'webPageReader',
        info:webPageReaderInfo,
        excute:webPageReader
    }
]