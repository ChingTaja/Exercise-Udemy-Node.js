// 加速 ~~

// Stream 

///Execution Time: 600ms (快!)
// CPU Usage: 55% (one core)
// Memory Usage: 

const { open } = require('node:fs/promises');

const writeMany = async () => {
    console.time('write many')
    let fileHandle = await open('./text.txt', 'w')

    // 只是範例 , 不要這樣子寫 !! 會用掉很多 memory
    const stream = fileHandle.createWriteStream()
    try {
        for (let i = 0; i < 100000; i++) {
            const buffer = Buffer.from(`${i} `, 'utf-8')

            stream.write(buffer)
        }

        await fileHandle.close();
        console.log('寫入完成');
    } catch (e) {
        console.log('An error occurred', e)
    }
    console.timeEnd('write many')
}

writeMany()