// 加速 ~~

// Stream 

///Execution Time: 600ms (快!)
// CPU Usage: 55% (one core)
// Memory Usage: 

const { open } = require('node:fs/promises');

const writeMany = async () => {
    console.time('write many')
    let fileHandle = await open('./text.txt', 'w')

    // 只是範例 , 不要這樣子寫 !! 這樣寫是 持續寫東西進 Stream 沒有處理背壓
    // 資料傳輸過快，接收端來不及處理，系統會對傳送端施加壓力，要求它放慢速度 (Back pressure )
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