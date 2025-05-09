// 建議用　pipeline

const { open, write, readFile } = require('node:fs/promises');

((async () => {
    console.time("copy")
    let srcFile = await open('text-small.txt', 'r')
    let destFile = await open('text-copy.txt', 'w')


    const readStream = srcFile.createReadStream()
    const writeStream = destFile.createWriteStream()

    console.log(readable.readableFlowing) // null

    // pipe (讀東西出來~寫東西進去~)自動處理 back pressure
    readStream.pipe(writeStream)
    console.log(readable.readableFlowing) // true

    readStream.unpipe(writeStream)
    console.log(readable.readableFlowing) // false

    readStream.on("end", () => {
        console.timeEnd("copy")
    })
}))()