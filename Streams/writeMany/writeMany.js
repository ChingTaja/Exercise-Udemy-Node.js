// Promise
const { open } = require('node:fs/promises');


const writeMany = async () => {
    console.time('write many')
    let fileHandle = await open('./text.txt', 'w')

    ///Execution Time: 6s
    // CPU Usage: 100% (one core)
    // Memory Usage: 500MB
    try {
        for (let i = 0; i < 100000; i++) {
            await fileHandle.write('1111\n')
        }

        await fileHandle.close();
        console.log('寫入完成');
    } catch (e) {
        console.log('An error occurred', e)
    }
    console.timeEnd('write many')
}

writeMany()

// Callback