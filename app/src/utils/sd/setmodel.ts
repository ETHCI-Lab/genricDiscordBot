import fs from "fs"
import { logger } from "../log";
import { asyncGet } from "../fetch";
import { StateManger } from "../StateManger";
require('dotenv').config()

export const setModel = async () => {

    const getModels = `${process.env.sdEndPoint}/sdapi/v1/sd-models`
    const list: Array<{ name: string, value: string }> = []
    const res: Array<{ title: string, model_name: string }> = await asyncGet(getModels);
    res.forEach((option) => list.push({ name: option.model_name, value: option.title }));
    StateManger.setModelOption(list);
    
}
