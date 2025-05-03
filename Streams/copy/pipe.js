const { open, write, readFile } = require('node:fs/promises');

((async () => {
    console.time("copy")
    let srcFile = await open('text-small.txt', 'r')
    let destFile = await open('text-copy.txt', 'w')

    const readStream = srcFile.createReadStream()
    const writeStream = destFile.createWriteStream()

    // pipe (讀東西出來~寫東西進去~)自動處理 back pressure
    readStream.pipe(writeStream)
    readStream.on("end", () => {
        console.timeEnd("copy")
    })
}))()