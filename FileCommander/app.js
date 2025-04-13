const { watch, open } = require('node:fs/promises');
const { Buffer } = require('buffer');

// 1. open (32)  將 file desciptor 讀進 memory
// 2. read or write ...
// 3. close (release memory)

(async () => {
    // create file (write)
    const createFile = async (filePath) => {

        try {
            // check if file existed
            let existingFileHandler = await open(filePath, 'r')// An exception occurs if the file does not exist.
            existingFileHandler.close()

            return `the file ${filePath} alrady exists`
        } catch (e) {
            // promise 版本回傳　file handle
            let newFileHandler = await open(filePath, 'w') // create
            newFileHandler.write('hello word') //write

            newFileHandler.close()
        }
    }

    let commandFileHandle = await open('./command.txt', 'r')
    commandFileHandle.on('change', async () => {
        // get file size
        const size = (await commandFileHandle.stat()).size

        // read() => 如果沒帶入參數, 會挖太多or太少記憶體
        // read( 挖多少 memory , 挖出來的 buffer 從哪裡開始填 (default = 0), buffer 多少長度 , file 從哪裡開始讀)
        let buffer = Buffer.alloc(size)
        let offset = 0
        let length = buffer.byteLength
        let position = 0
        const content = await commandFileHandle.read(buffer, offset, length, position)
        console.log(content)

        const command = buffer.toString('utf-8')
        const CREATE_FILE = 'create a file'
        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1)
            createFile(filePath)
        }
    })


    // watcher (trigger)
    // 可放入檔案夾 (ex: ""./") OR 檔案
    const watcher = watch('./command.txt') // return async iterator
    for await (const event of watcher) {
        if (event.eventType === 'change') {
            commandFileHandle.emit('change')
        }
    }
})()