// Stream 

const { open } = require('node:fs/promises');

const writeMany = async () => {
    console.time('write many')
    let fileHandle = await open('./text.txt', 'w')


    const stream = fileHandle.createWriteStream()
    const buffer = Buffer.alloc(16383, 10)

    // ! 避免讓 writableLength 大於 writableHighWaterMark ! 
    console.log(stream.writableHighWaterMark) // internal buffer max watermark 16384
    console.log(stream.writableLength) // internal buffer
    console.log(stream.write(buffer))
    console.log(stream.write(Buffer.alloc(1, "a")))
    console.log(stream.write(Buffer.alloc(1, "a")))

    stream.on('drain', () => {
        console.log('Internal Buffer 之前滿了又被清空了, 可以放東西進來了')
    })


    try {
        // for (let i = 0; i < 100000; i++) {
        //     const buffer = Buffer.from(`${i} `, 'utf-8')

        //     stream.write(buffer)
        // }

        // await fileHandle.close();
        console.log('寫入完成');
    } catch (e) {
        console.log('An error occurred', e)
    }
    console.timeEnd('write many')
}

writeMany()