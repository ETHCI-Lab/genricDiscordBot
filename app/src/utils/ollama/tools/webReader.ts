import { Tool } from "ollama";
import { resp } from "../../resp";
import { asyncGet } from "../../fetch";
import { compile, convert } from "html-to-text";
import {JSDOM} from "jsdom"

export const webPageReader = async(args: { [key: string]: any }):Promise<string | null> =>{
    const url:string | undefined = args.url;
    if (url) {
        const htmls = []
        const text = await (await fetch(url)).text()
        const dom = new JSDOM(text).window.document
        const child = dom.body.childNodes
        const metaData = dom.head
        child.forEach((el:ChildNode)=>{
            console.log(el.toString()+"\n")
        })

        // const ans = convert(text)
        // console.log(ans)
    }else{
        return null
    }
}

export const webPageReaderInfo:Tool = {
    type: "webPageReader",
    function: {
        name: "webPageReader",
        description: "需要時可以呼叫, 讀取url中的內容",
        parameters: {
            type: "object",
            required: [],
            properties: {
                url: {
                    type: "string",
                    description: "要讀取的url"
                }
            }
        }
    }
}