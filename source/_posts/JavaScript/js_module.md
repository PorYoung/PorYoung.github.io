---
title: "JS 模块化"
date: "2022-06-19 21:13:02"
categories:
  - "JavaScript"
tags:
  - JavaScript
  - notes
---

## Closure

闭包：有权访问另一个函数作用域中变量的函数。

一个作用域可以访问另外一个函数内部的局部变量，就产生闭包，局部变量在函数执行完后不会被立即销毁，而是等所有函数调用完该变量后再销毁。

闭包的主要作用：延伸变量的作用范围。

**过度使用闭包会造成内存泄漏。**

### 应用

#### 模拟类私有属性

```javascript
// 模拟私有属性
function getGeneratorFunc() {
  var _name = "John";
  var _age = 22;

  return function () {
    return {
      getName: function () {
        return _name;
      },
      getAge: function () {
        return _age;
      },
    };
  };
}

var obj = getGeneratorFunc()();
obj.getName(); // John
obj.getAge(); // 22
obj._age; // undefined
```

#### 柯里化（currying）

柯里化（currying），是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

柯里化的优势之一就是**参数的复用**，它可以在传入参数的基础上生成另一个全新的函数，如函数`bind`方法的实现。

```javascript
// bind
Function.prototype.myBind = function (context = window) {
  if (typeof this !== "function") throw new Error("Error");
  let selfFunc = this;
  let args = [...arguments].slice(1);

  return function F() {
    // 因为返回了一个函数，可以 new F()，所以需要判断
    if (this instanceof F) {
      return new selfFunc(...args, arguments);
    } else {
      // bind 可以实现类似这样的代码 f.bind(obj, 1)(2)，所以需要将两边的参数拼接起来
      return selfFunc.apply(context, args.concat(arguments));
    }
  };
};

// Example
function typeOf(value) {
  return function (obj) {
    const toString = Object.prototype.toString;
    const map = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regExp",
      "[object Undefined]": "undefined",
      "[object Null]": "null",
      "[object Object]": "object",
    };
    return map[toString.call(obj)] === value;
  };
}

var isNumber = typeOf("number");
var isFunction = typeOf("function");
var isRegExp = typeOf("regExp");

isNumber(0); // => true
isFunction(function () {}); // true
isRegExp({}); // => false
```

## 作用域

JS 中使用的是词法作用域（lexical scopes），也即静态作用域，函数的作用域在定义的时候已经确认，和执行的位置无关。动态作用域的语言如`bash`，在下例中会输出 2。

```javascript
var value = 1;

function foo() {
  console.log(value); // 1
}

function bar() {
  var value = 2;
  foo();
}

bar();
```

JS 中创建作用域：

1. 创建函数作用域
2. `let`、`const`创建块级作用域
3. `try...catch`中，`err`仅存在于`catch`子句中
4. `eval("var b = 3")`欺骗语法作用域
5. `with(obj)`临时扩展作用域

> [作用域和闭包](https://mitianyi.gitbook.io/frontend-interview-guide/javascript-basics/scope-and-closure)

## 模块化

> [模块化](https://mitianyi.gitbook.io/frontend-interview-guide/javascript-basics/modularization)

- 解决变量间相互污染的问题，以及变量命名冲突的问题
- 提高代码的可维护性、可拓展性和复用性

### 自执行函数实现模块化

> 自执行函数本质上是通过函数作用域解决了命名冲突、污染全局作用域的问题。

### AMD、CMD、UMD

#### AMD (Asynchronous Module Definition)

`RequireJS`

AMD 采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到所有依赖项都加载完成之后，这个回调函数才会运行。

```javascript
// AMD
define(["./a", "./b"], function (a, b) {
  // 加载模块完毕可以使用
  a.do();
  b.do();
});
```

#### CMD (Common Module Definition)

`SeaJS`

CMD 可以使用 `require` 同步加载依赖，也可以使用 `require.async` 来异步加载依赖。

```javascript
// CMD
define(function (require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require("./a");
  a.doSomething();

  // 也可以使用 require.async 来延迟加载
  require.async("./b", function (b) {
    b.doSomething();
  });
});
```

> AMD 和 CMD 相比，很大的一个区别就是引入模块的时机，AMD 是前置依赖，也就是说，目标模块代码执行前，必须保证所有的依赖都被引入并且执行。CMD 是后置依赖，也就是说，只有在目标代码中手动执行 `require(..)` 的时候，相关依赖才会被加载并执行。
> 还有一个区别就是引入模块的方式，AMD 的定位是浏览器环境，所以是异步引入；而 CMD 的定位是浏览器环境和 `Node` 环境，它可以使用 `require` 进行同步引入，也可以使用 `require.async` 的方式进行异步引入。

#### UMD

`jquery`

对 AMD 和 CMD 以及全局注册的方式做了整合。

```javascript
// UMD
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // Node, CommonJS-like
    module.exports = factory(require("jquery"));
  } else {
    // Browser globals (root is window)
    root.returnExports = factory(root.jQuery);
  }
})(this, function ($) {
  //    methods
  function myFunc() {}

  //    exposed public method
  return myFunc;
});
```

#### CommonJS

CommonJS 是的 NodeJS 所使用的一种服务端的模块化规范，它将每一个文件定义为一个 module ，模块必须通过 module.exports 导出对外的变量或接口，通过 require() 来导入其他模块的输出到当前模块作用域中。

如果`require`的路径不以`/`或`./`开头，会依次搜索`Node`的核心模块，各级目录下的`node_modules`目录，若未找到，则会自动添加文件后缀`.js`、`.json`、`.node`，再次寻找。

#### ES6 ESModule

1. export 导出的必须是接口，`export default`例外
2. 模块继承：`export { vueComponent as newVueComponent } from './app.vue';`，或`default`版本，`export { default } from './app.vue';`

#### CommonJs vs. ESModule

> [Node.js module system](http://nodejs.cn/api/packages.html#determining-module-system)

1. CommonJS 模块输出的是一个值的拷贝，ESModule 输出的是值的引用。CommonJS 输出的是值的拷贝，也就是说一旦输出，模块内部的变化就影响不到这个值。

```javascript
/*
 * CommonJS
 */
// mod.js
let counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  getCounter: () => counter,
  counter,
  incCounter,
};

// main.js
let mod = require("./mod");

console.log(mod.counter); // 3
mod.incCounter();
console.log(mod.counter); // 3
console.log(mod.getCounter()); // 4

/*
 * ESModule
 */
// mod.js
let counter = 3;
function incCounter() {
  counter++;
}
function getCounter() {
  return counter;
}
export { counter, incCounter, getCounter };

// main.js
import { counter, getCounter, incCounter } from "./mod.js";

console.log(counter); // 3
incCounter();
console.log(counter); // 4
console.log(getCounter()); // 4
```

> ESModule 的模块化是静态的，和 CommonJS 不同，ESModule 模块不是对象，而是通过 export 命令显示输出的指定代码的片段，再通过 import 命令将代码命令输入。也就是说在编译阶段就需要确定模块之间的依赖关系，这一点不同于 AMD / CMD / CommonJS ，这三者都是在运行时确定模块间的依赖关系的。

2. ES6 的模块自动采用严格模式
3. ESModule 导出的模块是只读的，不能变更，否则报错，如修改`counter`，会报：`Uncaught TypeError: Assignment to constant variable. at main.js`
