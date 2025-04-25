
// Callback

// Execution Time: 0.8s
// CPU Usage: 40% (one core)
// Memory Usage: 500MB

const fs = require('node:fs');

const writeMany = async () => {

    console.time('write many')
    fs.open('./text.txt', 'w', (err, fd) => {
        for (let i = 0; i < 100000; i++) {
            fs.writeSync(fd, `${i} `)
        }
    })
    console.timeEnd('write many')
}

writeMany()