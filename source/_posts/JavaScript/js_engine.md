---
title: "JS Engine"
date: 2022-06-19 14:52:08
categories:
  - "JavaScript"
tags:
  - JavaScript
  - notes
---

JS 引擎加载脚本文件后：语法分析、预编译、解释执行。

匿名函数不参与预编译，只有在解释执行阶段才会进行变量初始化。

![](https://qinu.poryoung.cn/img/202206191534572.png)

## JS 执行线程

> [javascript 引擎执行的过程的理解--执行阶段](https://segmentfault.com/a/1190000018134157)

JS 是单线程的是指永远只有 JS 引擎线程在执行 JS 脚本程序，其他的三个线程只协助，不参与代码解析与执行。

1. JS 引擎线程：也称为 JS 内核，负责解析执行 Javascript 脚本程序的主线程（例如 V8 引擎）。
2. 事件触发线程：归属于浏览器内核进程，不受 JS 引擎线程控制。主要用于控制事件（例如鼠标，键盘等事件），当该事件被触发时候，事件触发线程就会把该事件的处理函数推进事件队列，等待 JS 引擎线程执行。
3. 定时器触发线程：主要控制计时器 setInterval 和延时器 setTimeout，用于定时器的计时，计时完毕，满足定时器的触发条件，则将定时器的处理函数推进事件队列中，等待 JS 引擎线程执行。（注：W3C 在 HTML 标准中规定 setTimeout **低于 4ms 的时间间隔算为 4ms**。）
4. HTTP 异步请求线程：通过 XMLHttpRequest 连接后，通过浏览器新开的一个线程，监控 readyState 状态变更时，如果设置了该状态的回调函数，则将该状态的处理函数推进事件队列中，等待 JS 引擎线程执行。

> 注：浏览器对同一域名请求的并发连接数是有限制的，Chrome 和 Firefox 限制数为 6 个，ie8 则为 10 个

## JS 异步执行机制——Even Loop

## JS 宏任务、微内核

> [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

### 引申

#### setTimeout 与 setInterval 区别

#### 防抖和节流
