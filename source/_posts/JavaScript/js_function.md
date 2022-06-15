---
title: "JS Function"
date: "2022-06-15"
categories:
  - "JavaScript"
tags:
  - JavaScript
  - notes
  - snippets
---

- 函数声明的方式

  1. `function`关键字
  2. 函数表达式（匿名函数）`var 变量名 = function([形参1,形参2...形参N]){}`
  3. 构造函数`var 变量名/函数名 = new Function('形参1', '形参2', '函数体');`

- 函数调用

  1. `func()`
  2. `func.call()`
  3. `(function(){})();`
  4. `new func()`
  5. 事件调用
  6. 定时调用

- 函数类数组实参`arguments`
  1. 函数调用隐含传入上下文对象`this`和封装实参的对象`arguments`
  2. 在递归调用中用`arguments.callee`代替自身函数名可以接触函数体内代码与函数名的耦合，但会导致函数体内的`this`对象被更改，同时访问`arguments`是个很昂贵的操作，因为它是个很大的对象，每次递归调用时都需要重新创建，影响现代浏览器的性能，还会影响闭包。
