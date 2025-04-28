// Stream 

const { open } = require('node:fs/promises');
const { resolve } = require('node:path');


(async () => {

    let fileHandle = await open('./text.txt', 'w')
    const stream = fileHandle.createWriteStream()

    // resume loop when internal buffer is empty
    stream.on('drain', () => {
        console.log('Internal Buffer 之前滿了又被清空了, 可以放東西進來了')
        writeMany()
    })

    stream.on('finish', () => {
        fileHandle.close()
        console.timeEnd('write many')
    })

    stream.on('close', () => {
        console.log('底層資源被釋放了')
    })

    console.time('write many')
    let i = 0
    const writeMany = () => {


        /* 避免讓 writableLength 大於 writableHighWaterMark!!!
        const buffer = Buffer.alloc(16383, 10)
    
    
        console.log(stream.writableHighWaterMark) // Writable Stream - internal buffer max watermark 16384
        console.log(stream.writableLength) // internal buffer
        console.log(stream.write(buffer))
        console.log(stream.write(Buffer.alloc(1, "a")))
        console.log(stream.write(Buffer.alloc(1, "a")))
    
        stream.on('drain', () => {
            console.log('Internal Buffer 之前滿了又被清空了, 可以放東西進來了')
        })
    
        */
        while (i < 10000) {
            const buffer = Buffer.from(`${i} `, 'utf-8')
            if (i === 9999) {
                return stream.end(buffer)
                // stream.end 後面再 stream.write 會報錯
            }


            let isFilled = stream.write(buffer)

            i++
            // if internal buffer is full, stop the loop
            if (!isFilled) break
        }
    }


    writeMany()
})()