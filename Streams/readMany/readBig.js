const { open } = require('node:fs/promises');

(async () => {
    const fileHandleRead = await open('./text.txt', 'r')
    const fileHandleWrite = await open('./text-giant.txt', 'w')
    const streamRead = fileHandleRead.createReadStream({
        highWaterMark: 64 * 1024
    })

    const streamWrite = fileHandleWrite.createWriteStream()

    // Readable Stream data event
    streamRead.on("data", (chunk) => {
        // Readable Stream - internal buffer max watermark 是 64kb (64 * 1024)
        console.log(chunk.length)


        // if writable stream is full,pause the readable stream 
        if (!streamWrite.write(chunk)) {
            streamRead.pause()
        }

        streamWrite.on("drain", () => {
            streamRead.resume()
        })
    })
})()