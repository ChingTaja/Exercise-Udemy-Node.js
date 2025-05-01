const { open } = require('node:fs/promises');

(async () => {
    const fileHandleRead = await open('./text.txt', 'r')
    const fileHandleWrite = await open('./text-giant.txt', 'w')
    const streamRead = fileHandleRead.createReadStream({
        highWaterMark: 64 * 1024
    })

    const streamWrite = fileHandleWrite.createWriteStream()


    let splitItem = ''
    // Readable Stream data event
    streamRead.on("data", (chunk) => {
        // Readable Stream - internal buffer max watermark 是 64kb (64 * 1024)

        const numbers = chunk.toString("utf-8").split("  ")

        // FIX: 陣列的 頭部 尾部被切掉
        // 原因: (每個 chunk 有 watermark , 最後一個  item 有可能被 切一半 , 下一個 chunk 再放進來)
        // ex:［ ...,  48397, 483 ]  -> [ 98, 48399] 

        // if (第一個 + 1) 不等於 第二個 -> 出事了
        if (Number(numbers[0]) !== Number(numbers[1] - 1)) {

            if (numbers[0] === '') {
                splitItem = ''
                numbers.shift()
            }

            if (splitItem) {
                // fix first item (trim 去空格 , 返回新字串)
                numbers[0] = splitItem.trim() + numbers[0].trim()
            }
        }

        // if (倒數第二個 + 1) 不等於 (倒數最後一個) -> 出事了
        if ((Number(numbers[numbers.length - 2]) + 1) !== Number(numbers[numbers.length - 1])) {
            splitItem = numbers.pop().trim()
        }

        numbers.forEach((number) => {
            let n = Number(number)
            if (n % 2 === 0) {
                // if writable stream is full,pause the readable stream
                if (!streamWrite.write(" " + n + " ")) {
                    streamRead.pause()
                }
            }
        })
    })
    streamWrite.on("drain", () => {
        streamRead.resume()
    })


    streamRead.on('end', () => {
        console.log()
    })
})()
