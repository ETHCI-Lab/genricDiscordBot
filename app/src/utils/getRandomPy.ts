import { py } from "../enum/py";

export const getRandomPy = ()=>{
    const pyValues = Object.values(py);
    const randomIndex = Math.floor(Math.random() * pyValues.length);
    return pyValues[randomIndex];
}