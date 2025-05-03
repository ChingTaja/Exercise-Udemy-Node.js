const { open, write, readFile } = require('node:fs/promises');

// bad performance
// ((async () => {
//     let destFile = await open('./text-copy.txt', 'w')

//     // readFile（一次性非同步讀取整個檔案）
//     let result = await readFile('./text-giant.txt')
//     destFile.write(result)
// }))()

// use Stream but not use Node.js stream
((async () => {
    let srcFile = await open('text-small.txt', 'r')
    let destFile = await open('text-copy.txt', 'w')
    let bytesRead = -1

    while (bytesRead !== 0) {
        // FIX: 最後和倒數第二個 chunk　因為沒有read 導致剩下 write 的位置被 null 填滿
        resultRead = await srcFile.read()
        bytesRead = resultRead.bytesRead

        if (bytesRead !== 16384) {
            let findNotFilledIndex = resultRead.buffer.indexOf(0)

            // copy I want to new array
            let newBuffer = Buffer.alloc(findNotFilledIndex)
            // 被拷貝A.copy(拷貝B 到哪, B要從哪裡開始寫 , A從哪裡開始複製, A複製到哪結束)
            resultRead.buffer.copy(newBuffer, 0, 0, findNotFilledIndex)

            destFile.write(newBuffer)
        } else {
            destFile.write(resultRead.buffer)
        }
    }
}))()