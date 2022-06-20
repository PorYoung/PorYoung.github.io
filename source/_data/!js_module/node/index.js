let mod = require("./mod");

console.log(mod.counter); // 3
mod.incCounter();
console.log(mod.counter); // 3
console.log(mod.getCounter()); // 4
