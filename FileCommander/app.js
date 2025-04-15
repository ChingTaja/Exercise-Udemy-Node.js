const { watch, open, unlink, rename } = require('node:fs/promises');
const { Buffer } = require('buffer');
const path = require('path');

// 1. open (32)  將 file desciptor 讀進 memory
// 2. read or write ...
// 3. close (release memory)

(async () => {
    const CREATE_FILE = 'create a file'
    const DELETE_FILE = 'delete a file'
    const RENAME_FILE = 'rename the file'
    const ADD_TO_FILE = 'add to the file'

    const createFile = async (filePath) => {

        try {
            // check if file existed
            let existingFileHandler = await open(filePath, 'r')// An exception occurs if the file does not exist.
            existingFileHandler.close()

            return `the file ${filePath} alrady exists`
        } catch (e) {
            // promise 版本回傳　file handle
            let newFileHandler = await open(filePath, 'w') // create

            newFileHandler.close()
        }
    }

    const deleteFile = async (filePath) => {
        try {

            let abPath = path.resolve(filePath)
            console.log(`delete the ${abPath}`)
            await unlink(abPath)
        } catch (e) {
            console.log(e)
            if (e.code === 'ENOENT') {
                console.log('No file at this path to remove')
            } else {
                console.log('An error occurred while removing the file')
            }
        }

    }

    const renameFIle = async (oldFile, newFile) => {
        try {
            console.log(`rename the file ${oldFile} to ${newFile}`)
            await rename(oldFile, newFile)
        } catch (e) {
            console.log(e)
            if (e.code === 'ENOENT') {
                console.log(`No file at this path to rename, or the destination doesn't exist`)
            } else {
                console.log('An error occurred while renaming the file')
            }
        }
    }

    let addedContent;
    const addToFile = async (filePath, content) => {
        if (addedContent === content) return
        try {
            console.log(`add to the file ${filePath} this content ${content}`)
            let fileHandle = await open(filePath, 'w')

            fileHandle.write(content)
            addedContent = content
        } catch (e) {
            console.log(e)
            console.log('An error occurred while add content the file')
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

        // create:
        // create a file <path>
        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1)
            createFile(filePath)
        }

        // delete:
        // delete a file <path>
        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1)
            console.log(DELETE_FILE.length + 1)
            deleteFile(filePath)
        }

        // rename:
        // rename the file <old> to <new>
        if (command.includes(RENAME_FILE)) {
            // " to " 起始位置
            const _idx = command.indexOf(' to ')
            const oldPath = command.substring(RENAME_FILE.length + 1, _idx)
            const newPath = command.substring(_idx + ' to '.length)
            renameFIle(oldPath, newPath)
        }

        // add to file:
        // add to the file <path> this content:　<contnet>
        if (command.includes(ADD_TO_FILE)) {
            const _idx = command.indexOf(' this content:')
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx)
            const content = command.substring(_idx + ' this content: '.length)

            addToFile(filePath, content)
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