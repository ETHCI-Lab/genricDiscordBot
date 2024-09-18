import { DSMresp } from "../interfaces/DSMresp"
import fetch from "node-fetch"
import { logger } from "../utils/log"
import { StateManger } from "../utils/StateManger"
require('dotenv').config()

type info = {
    name:string,
    password:string
}

type state = {
    did: string,
    sid: string
}

export const loginDSM = async (info:info):Promise<DSMresp<state>> =>{
    const resp = await fetch(`${process.env.SynnologyDsmEndPoint}/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${info.name}&passwd=${info.password}&session=FileStation&format=cookie `)
    const ans = await resp.json() as DSMresp<state>

    if (ans.success) {
        logger.info(`login to DSM: ${info.name}`)
        StateManger.setDSMsid(ans.data.sid)
        StateManger.setDSMCookie(`${resp.headers.raw()['set-cookie']}`)
    }else{
        logger.error("cant login DSM")
    }
    return ans
    
} 
