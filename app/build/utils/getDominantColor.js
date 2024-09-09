"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDominantColor = void 0;
const node_vibrant_1 = __importDefault(require("node-vibrant"));
const getDominantColor = async (buffer) => {
    const palette = await node_vibrant_1.default.from(buffer).getPalette();
    if (palette.Vibrant) {
        const dominantColor = palette.Vibrant.getHex();
        return dominantColor;
    }
};
exports.getDominantColor = getDominantColor;
