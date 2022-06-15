---
title: "JS 数组"
date: "2022-06-15"
categories:
  - "JavaScript"
tags:
  - JavaScript
  - notes
  - snippets
---

## Fundamental

- `ECMAScript`中`new Array(len)`的操作

  1. 判断 len 是否为合法数字（小于 `2^32 - 1` 的正整数），如果不是则抛出错误；
  2. 创建一个 JavaScript Array 实例；
  3. 将这个实例对象的 length 属性设置为入参的值；

  但该数组此时并没有包含任何实际的元素，而且不能理所当然地认为它包含 len 个值为 undefined 的元素

  > More
  >
  > - `empty`和`undefined`的区别
  > - 导致数组的`map`、`some`、`filter`、`includes`、`for in`、`for of`、`findIndex`、`sort`等方法的差异
  > - 稀疏数组、密集数组的互相转换
  > - V8 访问对象有两种模式：字典模式 和 快速模式
  >
  > [JavaScript 之稀疏数组与密集数组](https://juejin.cn/post/6975531514444562462)
  >
  > [稀疏数组与密集数组](https://github.com/JunreyCen/blog/issues/10)

- 伪数组(ArrayLike)

  - 按索引方式储存数据
  - `length`不会动态变化
  - 伪数组的原型链中没有 Array.prototype，因此不具有`push`、`forEach`等方法

  常见的如`arguments`、DOM children 元素集。

  ```javascript
  // 伪数组转真数组
  Array.prototype.slice.call(ArrayLike);

  [].slice.call(ArrayLike);

  Array.from(ArrayLike);
  ```

- `sort`方法

  - 默认按 Unicode 编码排序
  - 自定义排序规则：return 大于 0 的值——元素交换位置，return 小于 0 的值——元素位置不变，return 等于 0 的值——不交换位置

  ```javascript
  // 冒泡排序
  arr.sort((a, b) => a - b);
  ```

- `forEach`会改变原数组吗，`map()`会吗 :question:

- `arr.reduce(function (previousValue, currentValue, currentIndex, arr) {}, initialValue);`

  - e.g. 统计元素出现的次数、找最大值等

- 清空数组

  ```javascript
  array.splice(0); //方式1：删除数组中所有项目
  array.length = 0; //方式2：length属性可以赋值，在其它语言中length是只读
  array = []; //方式3：推荐
  ```

- `join`的应用
  - 相比字符串拼接
    由于字符串的不变性，str 拼接过多的话，性能差，且容易导致内存溢出（很多个 str 都堆放在栈里）
