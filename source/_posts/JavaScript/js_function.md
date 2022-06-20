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

## 函数声明的方式

1. `function`关键字
2. 函数表达式（匿名函数）`var 变量名 = function([形参1,形参2...形参N]){}`
3. 构造函数`var 变量名/函数名 = new Function('形参1', '形参2', '函数体');`

## 函数调用

1. `func()`
2. `func.call()`
3. `(function(){})();`
4. `new func()`
5. 事件调用
6. 定时调用

## 函数类数组实参`arguments`

1. 函数调用隐含传入上下文对象`this`和封装实参的对象`arguments`
2. 在递归调用中用`arguments.callee`代替自身函数名可以接触函数体内代码与函数名的耦合，但会导致函数体内的`this`对象被更改，同时访问`arguments`是个很昂贵的操作，因为它是个很大的对象，每次递归调用时都需要重新创建，影响现代浏览器的性能，还会影响闭包。

## 函数预编译

函数预编译，发生在函数执行的前一刻。

> [JS 预编译、变量提升](https://juejin.cn/post/6844903575571677198)

1. 创建 Active Object 对象，即执行期上下文。
2. 寻找函数的形参和变量声明，将变量和形参名作为 AO 对象的属性名，值设定为 undefined.
3. 将形参和实参相统一，即更改形参后的 undefined 为具体的形参值。
4. 寻找函数中的函数声明，将函数名作为 AO 属性名，值为函数体。

> [JS 函数和变量声明提升](https://segmentfault.com/a/1190000038344251)

1. 函数声明提升优先于变量声明
2. 函数初始化也会提升

```javascript {cmd="node"}
console.log(a); // [Function: a]
var a = 1;
console.log(a); // 1
function a() {}
console.log(a); // 1

function b(a) {
	console.log(a); // [Function: a]
	var a = 2;
	console.log(a); // 2
	function a() {}
	console.log(a); // 2
}
b(3);
```

## `this` 指向

1. 以函数的形式（包括普通函数、定时器函数、立即执行函数）调用时，this 的指向永远都是 window。

2. 以方法的形式调用时，this 指向调用方法的那个对象

3. 以构造函数的形式调用时，this 指向实例对象

4. 以事件绑定函数的形式调用时，this 指向绑定事件的对象

5. 使用 call 和 apply 调用时，this 指向指定的那个对象

6. 箭头函数中 this 的指向会继承外层函数调用的 this 绑定（无论 this 绑定到什么）

```javascript {cmd="node"}
var name = "window";
var obj = {
	name: "obj",
	arrowFunc: () => {
		console.log(this, this.name);
	},
	func: function () {
		console.log(this, this.name);
	},
};

function func() {
	console.log(this, this.name);
}

// Window "window" || Object "obj" || Window "window"
func() || obj.func() || obj.arrowFunc();
```

## `call`, `apply`, `bind`

### `call`

`func.call(thisArg, ...argArray);`

1. 调用一个函数，同时可以改变这个函数内部的 this 指向
2. 实现继承

```javascript
function Father(myName, myAge) {
	this.name = myName;
	this.age = myAge;
}

function Son(myName, myAge) {
	Father.call(this, myName, myAge);
}
```

### `apply`

`func.apply(thisArg, ?argArray);`

1. 调用一个函数，同时可以改变这个函数内部的 this 指向
2. 求数组最值：`Math.max.apply(Math, array)`

### `bind`

`newFunc = func.bind(thisArg, ...argArray);`

`bind`不会立即执行函数，而是返回指定 this 和指定实参的原函数拷贝
