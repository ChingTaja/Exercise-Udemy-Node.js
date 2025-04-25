// Promise

///Execution Time: 6s
// CPU Usage: 55% (one core)
// Memory Usage: 600MB

const { open } = require('node:fs/promises');

const writeMany = async () => {
    console.time('write many')
    let fileHandle = await open('./text.txt', 'w')


    try {
        for (let i = 0; i < 100000; i++) {
            await fileHandle.write(`${i} `)
        }

        await fileHandle.close();
        console.log('寫入完成');
    } catch (e) {
        console.log('An error occurred', e)
    }
    console.timeEnd('write many')
}

writeMany()