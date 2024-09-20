import { DSMFiles } from "../interfaces/DSMFiles"
import { DSMresp } from "../interfaces/DSMresp"
import fetch from "node-fetch"
import { logger } from "./log"


export const getPyfileInfo = async (sid: string,cookie:string,folder_path:string): Promise<DSMresp<DSMFiles>> => {
    let path = encodeURI(`/ETHCI/無損音檔/${folder_path}`)
    const url = `${process.env.SynnologyDsmEndPoint}/webapi/entry.cgi?api=SYNO.FileStation.List&method=list&version=2&offset=0&limit=1000&sort_by=%22mtime%22&sort_direction=%22ASC%22&action=%22list%22&check_dir=true&additional=%5B%22real_path%22%2C%22size%22%2C%22owner%22%2C%22time%22%2C%22perm%22%2C%22type%22%2C%22mount_point_type%22%2C%22description%22%2C%22indexed%22%5D&filetype=%22all%22&folder_path=${path}&sid=${sid}`
    const resp = await fetch(url,{
        headers:{
            Cookie:cookie
        },
        method: 'GET',
    })

    const ans:DSMresp<DSMFiles> = await resp.json()
    return ans
}