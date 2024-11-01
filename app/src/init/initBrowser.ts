import { StateManger } from "../utils/StateManger"
import puppeteer from 'puppeteer';

export const initBrowser = async ()=>{
    StateManger.info.browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    })
}