import { getPyfileInfo } from "./getPyfileInfo"

export const getMusics = async (path: string) => {

    const musicFiles:Array<{name:string,path:string}> = []
    
    const findMusicFiles = async (currentPath:string) => {
        const list = await getPyfileInfo(currentPath);
        
        if (list?.data) {
            await Promise.all(list.data.files.map(async (file) => {
                if (file.isdir) {
                    await findMusicFiles(file.path.replace("/ETHCI/無損音檔/",""));
                } else {
                    musicFiles.push({
                        name: file.name,
                        path: file.additional.real_path
                    })
                }
            }));
        }
    }

    await findMusicFiles(path.replace("/ETHCI/無損音檔/",""))
    return musicFiles
}