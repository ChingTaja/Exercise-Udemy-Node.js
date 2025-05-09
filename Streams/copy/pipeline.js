const { open } = require('node:fs/promises');
const { pipeline } = require('node:stream/promises');


((async () => {
    console.time("copy")
    let srcFile = await open('text-small.txt', 'r')
    let destFile = await open('text-copy.txt', 'w')

    const readStream = srcFile.createReadStream()
    const writeStream = destFile.createWriteStream()

    pipeline(readStream, writeStream)
    console.timeEnd("copy")
}))()