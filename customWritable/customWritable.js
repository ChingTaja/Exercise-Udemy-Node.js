const { Writable } = require('node:stream')
const fs = required('node:fs')

class FileWriteStream extends Writable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark })

        this.fileName = fileName
        this.fd = null
    }

    // 在 constructor 執行後 執行
    // stream 相關的 api(像是 `_write` `_final` `_destory` ) 之前執行 -> 如果裡面放 setTimeout .. , stream 相關的 api 會被 put off
    // 直到 _construct 內的 callback 被執行
    _construct(callback) {
        fs.open(this.fileName, 'w', (err, fd) => {
            if(err){
                callback(err)
            } else {
                this.fd = fd
                callback()
            }
        })
    }

    _write(chunk, encoding, callback) {
        // do our write operation

        // when it's done, call the callback function
        // 必須在處理完該 chunk 之後呼叫 callback() 函數 , 通知底層 stream 系統：「這筆資料寫完了」，或是「寫入失敗了」
        callback()
    }
}

let stream = new FileWriteStream({ highWaterMark: 1800, fileName: './write.txt' })

stream.write(Buffer.from('write something'))
stream.write(Buffer.from('write something'))
stream.write(Buffer.from('write something'))
stream.end(Buffer.from('last write'))
stream.on('drain', () => {
    console.log('drain 被觸發了')
})