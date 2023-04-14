import { counter, getCounter, incCounter } from "./mod.js";

console.log(counter); // 3
incCounter();
console.log(counter); // 3
console.log(getCounter()); // 4

function debounce(fn, delay = 200) {
  let timeout;
  return function () {
    // 重新计时
    timeout && clearTimeout(timeout);
    timeout = setTimeout(fn.bind(this), delay, ...arguments);
  };
}

const handlerChange = debounce(function () {
  alert("更新触发了");
  console.log(this);
});

// 绑定监听
document.querySelector("input").addEventListener("input", handlerChange);

function throttle(fn, threshhold = 1000) {
  let timeout;
  // 计算开始时间
  let start = new Date();
  return function () {
    // 触发时间
    const current = new Date() - 0;
    timeout && clearTimeout(timeout);
    // 如果到了时间间隔点，就执行一次回调
    if (current - start >= threshhold) {
      fn.call(this, ...arguments);
      // 更新开始时间
      start = current;
    } else {
      // 保证方法在脱离事件以后还会执行一次
      timeout = setTimeout(fn.bind(this), threshhold, ...arguments);
    }
  };
}

let handleMouseMove = throttle(function (e) {
  console.log(e.pageX, e.pageY);
  console.log(this);
});

// 绑定监听
document.querySelector("#panel").addEventListener("mousemove", handleMouseMove);
