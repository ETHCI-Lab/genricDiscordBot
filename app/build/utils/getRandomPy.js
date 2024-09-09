"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomPy = void 0;
const py_1 = require("../enum/py");
const getRandomPy = () => {
    const pyValues = Object.values(py_1.py);
    const randomIndex = Math.floor(Math.random() * pyValues.length);
    return pyValues[randomIndex];
};
exports.getRandomPy = getRandomPy;
