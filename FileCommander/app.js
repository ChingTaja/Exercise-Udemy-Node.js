const { watch } = require('node:fs/promises');

(async () => {
    const watcher = watch('./') // return async iterator


    for await (const event of watcher) {
        console.log(event)
    }
})()