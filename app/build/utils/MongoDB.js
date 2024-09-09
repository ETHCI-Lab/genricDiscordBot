"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = void 0;
const mongoose_1 = require("mongoose");
const log_1 = require("../middlewares/log");
class MongoDB {
    DB;
    isConneted = false;
    constructor(info) {
        const url = `mongodb://${info.host}:${info.port}/${info.name}`;
        this.init(url).then(() => {
            log_1.logger.info(`suscess: connet to mongoDB @${url}`);
            this.isConneted = true;
        }).catch(() => {
            log_1.logger.error(`error: cannt connet to mongoDB @${url}`);
        });
    }
    async init(url) {
        this.DB = await (0, mongoose_1.connect)(url);
    }
    getState() {
        return this.isConneted;
    }
}
exports.MongoDB = MongoDB;
