"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
require('dotenv').config();
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
(0, winston_1.addColors)(colors);
const customFormat = winston_1.format.combine(winston_1.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }), winston_1.format.align(), winston_1.format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`));
const transport = new winston_daily_rotate_file_1.default({
    filename: `${process.env.LogPath}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '365d'
});
exports.logger = (0, winston_1.createLogger)({
    format: customFormat,
    transports: [
        transport
    ]
});
