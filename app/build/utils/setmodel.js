"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setModel = void 0;
const fs_1 = __importDefault(require("fs"));
const log_1 = require("./log");
const fetch_1 = require("./fetch");
require('dotenv').config();
const setModel = async () => {
    const getModels = `${process.env.sdEndPoint}/sdapi/v1/sd-models`;
    const list = [];
    const res = await (0, fetch_1.asyncGet)(getModels);
    res.forEach((option) => list.push({ name: option.model_name, value: option.title }));
    fs_1.default.writeFile(process.env.modelOption, JSON.stringify(list), (err) => {
        if (err) {
            log_1.logger.error('set sd option: Error writing to JSON file:', err);
        }
        else {
            log_1.logger.info('set sd option: Models have been written to models.json successfully.');
        }
    });
};
exports.setModel = setModel;
