import { Schema, model, connect } from 'mongoose';
import { logger } from '../middlewares/log';
import { MongoInfo } from '../interfaces/MongoInfo';

export class MongoDB {
    
    DB!: typeof import("mongoose");
    isConneted : boolean = false;

    constructor(info: MongoInfo) {

        const url = `mongodb://${info.host}:${info.port}/${info.name}`

        this.init(url).then(() => {

            logger.info(`suscess: connet to mongoDB @${url}`);
            this.isConneted = true;

        }).catch(() => {

            logger.error(`error: cannt connet to mongoDB @${url}`);

        })

    }

    async init(url: string): Promise<void> {
        this.DB = await connect(url);
    }

    getState():boolean{
        return this.isConneted;
    }
}

