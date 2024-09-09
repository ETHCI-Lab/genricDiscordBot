import Vibrant from 'node-vibrant';

export const getDominantColor = async (buffer: Buffer) => {
    const palette = await Vibrant.from(buffer).getPalette();
    if (palette.Vibrant) {
        const dominantColor = palette.Vibrant.getHex();
        return dominantColor;
    }
};