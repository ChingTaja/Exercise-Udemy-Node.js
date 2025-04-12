// Global 就有 Buffer 不需要引入, 官方建議還是 include
const { Buffer } = require('buffer');

// 第二個是初始化的值, 預設是 0, 可以不填
const memoeryContainer = Buffer.alloc(4, 0); // "bytes"

console.log(memoeryContainer); // 初始化塞 0
// <Buffer 00 00 00 00> 用 "hex" 表示(convention)

// 不建議, 下面作法是直接對 binary data 操作
memoeryContainer[0]; // access 用 "decimal" 表示
memoeryContainer[0] = 0xff; // write
memoeryContainer[1] = 0x33;
memoeryContainer[2] = 0x13;
memoeryContainer[3] = 0xea;

//建議
memoeryContainer.write(-34, 2); // access
console.log(memoeryContainer.readInt8(2)); //write
// 每個 bytes 最多存取 255個 value

// 建立 buffer, 自動 alloc size
let buffer1 = Buffer.from([0x48, 0x69, 0x21]);
let buffer2 = Buffer.from(486921, 'hex'); // 這是 hex, 轉成 buffer給我
let buffer3 = Buffer.from('Hi', 'utf-8'); // 這是 utf-8, 轉成 buffer給我
// toString (各種010101 => 看得懂)
console.log(buffer1.toString('utf-8'));

const num = 111;
const buf = Buffer.alloc(4); // 4 bytes for a 32-bit integer
buf.writeInt32BE(num); // 寫入 32-bit 整數
console.log(buf); // <Buffer 00 00 00 6f>
