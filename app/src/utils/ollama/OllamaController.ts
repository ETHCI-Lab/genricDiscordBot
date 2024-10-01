import { logger } from "../log";
import { ChatResponse, Message, ModelResponse, Ollama, Tool } from "ollama";
import { Dic } from "../../interfaces/Dic";
import { toolInfo } from "../../interfaces/toolInfo";
import { toolRoutes } from "../../init/toolRouter";
import { sdResp } from "../../interfaces/sdResp";

export class OllamaController {

    private mem: Dic<Message[]>
    private client
    private endPoint: string
    private model:string
    private toolDic:Dic<(args: { [key: string]: any }) => Promise<any>>
    private replyMode: "stream" | "await"
    public toolInfoDic:Dic<Tool>
    public modelList:Array<ModelResponse> = []

    constructor() {

        this.endPoint = process.env.llamaEndPoint as string
        this.mem = {}
        this.toolDic = {}
        this.toolInfoDic = {}
        this.model = "llama3.1:latest"
        this.replyMode = "stream"
        
        this.client = new Ollama({
            host: this.endPoint
        });

        this.initTool()
        
    }

    pushMem(payload: Message, session: string): Array<Message> {

        if (!this.mem[session]) {
            this.mem[session] = []
        }

        this.mem[session].push(payload)
        return this.mem[session]
    }

    getMem(session: string) {
        return this.mem[session]
    }

    initTool(){
        toolRoutes.forEach(tool=>{
            this.toolDic[tool.id] = tool.excute
            this.toolInfoDic[tool.id] = tool.info
        })
        
    }

    setTool(payload:toolInfo){
        this.toolDic[payload.id] = payload.excute
    }

    getToolInfoDic(){
        return this.toolInfoDic
    }

    setModel(name:string){
        this.model = name
    }

    setReplyMode(name:"stream" | "await"){
        this.replyMode = name
    }

    getReplyMode(){
        return this.replyMode
    }

    async initModelList(){
        const list = await this.client.list()
        this.modelList = list.models
    }

    async system(prompt: string, session: string) {

        if (!this.mem[session]) {
            this.mem[session] = []
        }

        if (this.mem[session][0]) {
            this.mem[session][0] = {
                role: 'system',
                content: prompt
            }
        }else{
            this.mem[session].push(
                {
                    role: 'system',
                    content: prompt
                }
            )
        }

    }

    async sendChatStream(prompt: string, session: string) {

        this.pushMem(
            {
                role: 'user',
                content: prompt
            }, session
        )


        try {
            const response = await this.client.chat({
                model: this.model,
                messages: this.mem[session],
                stream: true,
                options:{
                    num_predict:800
                }
            })

            return response

        } catch (error) {
            logger.info(error)
            return null
        }

    }

    async sendChat(prompt: string, session: string,tools?:Tool[]):Promise<ChatResponse&{img?:sdResp} | null> {

        let img:sdResp|undefined = undefined

        this.pushMem(
            {
                role: 'user',
                content: prompt
            }, session
        )


        try {
            const response = await this.client.chat({
                model: this.model,
                messages: this.mem[session],
                stream: false,
                options:{
                    num_predict:800
                },
                tools: tools,
            })

            this.pushMem(
                {
                    role: 'assistant',
                    content: response.message.content
                }, session
            )

            /**
             * 叫沒叫工具
             */
            if (!response.message.tool_calls || response.message.tool_calls.length === 0) {
                /**
                 * 沒叫直接回
                 */
                return {
                    ...response,
                    img:img
                }
            }else{

                /**
                 * 有叫弄進記憶再回
                 */
                for (const tool of response.message.tool_calls) {
                    const functionToCall = this.toolDic[tool.function.name];
                    const functionResponse = await functionToCall(tool.function.arguments);
                    if (functionResponse.images) {
                        img = functionResponse
                    }
                    this.pushMem(
                        {
                            role: 'tool',
                            content: JSON.stringify(functionResponse)
                        }, session
                    )
                }

                const finalResponse = await this.client.chat({
                    model: this.model,
                    messages: this.mem[session],
                });

                this.pushMem(
                    {
                        role: 'assistant',
                        content: finalResponse.message.content
                    }, session
                )
    

                return {
                    ...finalResponse,
                    img:img
                }

            }

            

        } catch (error) {
            logger.info(error)
            return null
        }

    }

    async clear(session: string) {
        this.mem[session] = []
    }

    async clearAll(session: string) {
        this.mem = {}
    }

}