// Stream 

const { open } = require('node:fs/promises');

const writeMany = async () => {
    console.time('write many')
    let fileHandle = await open('./text.txt', 'w')


    const stream = fileHandle.createWriteStream()
    const buffer = Buffer.alloc(16384, 10)

    console.log(stream.writableHighWaterMark) // internal buffer max watermark 16384
    console.log(stream.writableLength) // internal buffer
    const isFilled = stream.write(buffer)
    console.log(isFilled)

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