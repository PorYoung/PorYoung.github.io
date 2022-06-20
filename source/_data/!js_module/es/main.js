import { counter, getCounter, incCounter } from "./mod.js";

console.log(counter); // 3
incCounter();
console.log(counter); // 3
console.log(getCounter()); // 4
