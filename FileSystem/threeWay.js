// Promise API
const fsPromise = require('fs/promises');

(async () => {
    try {
        await fsPromise.copyFile('example.txt', 'copied_example_promise.txt')
    } catch (e) {
        console.log(e)
    }
})()

// Callback API
const fs = require('fs')

fs.copyFile('example.txt', 'copied_example_cb.txt', (err) => { // cb first param is error
    console.log(err)
})

// Sync API
fs.copyFileSync('example.txt', 'copied_exaple_sync.txt')