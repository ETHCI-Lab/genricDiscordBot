import { Tool } from "ollama";
import { compile, convert } from "html-to-text";
import { JSDOM } from "jsdom"
import { child } from "winston";
import { StateManger } from "../../StateManger";

export const webPageReader = async (args: { [key: string]: any }): Promise<{
    body: string,
    text: string
}> => {
    const url: string | undefined = args.url;
    if (url) {
        const browser = StateManger.getBrowser();
        if (browser) {
            const page = StateManger.info.pages.length == 0? await browser.newPage():StateManger.info.pages[1];
            await page.goto(url,{ waitUntil: 'networkidle2' })
            const text = await page.content();

            const ans = convert(text)
    
            return {
                body: ans,
                text: ans
            }
        }else{
            return {
                body: "page not found",
                text: "page not found"
            }
        }
    } else {
        return {
            body: "page not found",
            text: "page not found"
        }
    }
}

export const webPageReaderInfo: Tool = {
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