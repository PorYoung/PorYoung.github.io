---
title: "JS Tips"
date: "2022-06-19"
categories:
  - "JavaScript"
tags:
  - JavaScript
  - notes
  - snippets
---

## 未声明赋值变量

任何变量，如果未经声明就赋值，此变量是属于 window 的属性，而且不会做变量提升。（注意，无论在哪个作用域内赋值）

```javascript
function foo() {
  var a = (b = 100); // a和b的区别
}
```

## `defer` and `async`

The best thing to do to speed up your page loading when using scripts is to put them in the head, and add a defer attribute to your script tag.

> [Efficiently load JavaScript with defer and async](https://flaviocopes.com/javascript-async-defer/)

## 防抖和节流

1.  防抖（deounce）:

    - 可用于 input.change 实时输入校验，比如输入实时查询，你不可能摁一个字就去后端查一次，肯定是输一串，统一去查询一次数据。
    - 可用于 window.resize 事件，比如窗口缩放完成后，才会重新计算部分 DOM 尺寸

2.  节流（throttle），用于监听 mousemove、 鼠标滚动等事件，通常可用于：拖拽动画、下拉加载。

> 节流通常用在比防抖刷新更频繁的场景下，而且大部分是需要涉及动画的操作。

```javascript
/* 防抖 */
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
});

// 绑定监听
document.querySelector("input").addEventListener("input", handlerChange);
```

```javascript
// 立即执行的防抖函数
function debounce(fn, delay = 200) {
  let timeout;
  return function () {
    // 如果 timeout == null 说明是第一次，直接执行回调，否则重新计时
    +timeout == null ? fn.call(this, ...arguments) : clearTimeout(timeout);
    timeout = setTimeout(fn.bind(this), delay, ...arguments);
  };
}

const handlerChange = debounce(function () {
  alert("更新触发了");
});

// 绑定监听
document.querySelector("input").addEventListener("input", handlerChange);
```

```javascript
/* 节流 */
function throttle(fn, threshhold = 200) {
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
});

// 绑定监听
document.querySelector("#panel").addEventListener("mousemove", handleMouseMove);
```

## 正则表达式

`new RegExp("正则表达式", "匹配模式")`、`/正则表达式/匹配模式`。

全局匹配模式 `g` 一般用于 `exec()`、`match()`、`replace()`等方法。

全局匹配模式 `g` 如果用于 `test()`方法，`g` 模式会生成一个 `lastindex` 参数来存储匹配最后一次的位置。

1. `[]`：或
2. `[^]`：非、除了
3. `^`：以...开头，`$`：以...结尾
4. 支持正则的 String 方法：`split()`、`search()`、`match()`、`replace()`

## `offset`、`scroll`、`client`区别

1. 区别 1：宽高

   - offsetWidth = width + padding + border
   - offsetHeight = height + padding + border
   - scrollWidth = 内容宽度（不包含 border）
   - scrollHeight = 内容高度（不包含 border）
   - clientWidth = width + padding
   - clientHeight = height + padding

2. 区别 2：上左
   - offsetTop/offsetLeft：
     调用者：任意元素。(盒子为主)
     作用：距离父系盒子中带有定位的距离。
   - scrollTop/scrollLeft：
     调用者：document.body.scrollTop（window 调用）(盒子也可以调用，但必须有滚动条)
     作用：浏览器无法显示的部分（被卷去的部分）。
   - clientY/clientX：
     调用者：event
     作用：鼠标距离浏览器可视区域的距离（左、上）。

## 获取滚动位置

判断是否声明 DTD：`document.compatMode === "CSS1Compat" // 已声明`、`document.compatMode === "BackCompat" // 未声明`。

```javascript
function scroll() {
  return {
    //此函数的返回值是对象
    top:
      window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop,
    left:
      window.pageXOffset ||
      document.body.scrollLeft ||
      document.documentElement.scrollLeft,
  };
}

function scroll() {
  // 开始封装自己的scrollTop
  if (window.pageYOffset !== undefined) {
    // ie9+ 高版本浏览器
    // 因为 window.pageYOffset 默认的是  0  所以这里需要判断
    return {
      left: window.pageXOffset,
      top: window.pageYOffset,
    };
  } else if (document.compatMode === "CSS1Compat") {
    // 标准浏览器   来判断有没有声明DTD
    return {
      left: document.documentElement.scrollLeft,
      top: document.documentElement.scrollTop,
    };
  }
  return {
    // 未声明 DTD
    left: document.body.scrollLeft,
    top: document.body.scrollTop,
  };
}
```

## 获取浏览器可视区域宽高

```javascript
//函数封装：获取屏幕可视区域的宽高
function client() {
  if (window.innerHeight !== undefined) {
    //ie9及其以上的版本的写法
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  } else if (document.compatMode === "CSS1Compat") {
    //标准模式的写法（有DTD时）
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  } else {
    //没有DTD时的写法
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };
  }
}
```
