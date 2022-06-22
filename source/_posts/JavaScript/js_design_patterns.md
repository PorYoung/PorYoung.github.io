---
title: "JS 设计模式"
date: "2022-06-20 20:44:47"
categories:
  - "JavaScript"
tags:
  - JavaScript
  - notes
---

## 单例模式[^ob_scope_closure]

单例模式避免了重复实例化带来的内存开销。

```javascript
// 单例模式
function Singleton() {
  this.data = "singleton";
}

Singleton.getInstance = (function () {
  var instance;

  return function () {
    if (instance) {
      return instance;
    } else {
      instance = new Singleton();
      return instance;
    }
  };
})();

var sa = Singleton.getInstance();
var sb = Singleton.getInstance();
console.log(sa === sb); // true
console.log(sa.data); // 'singleton'
```

## References

1. [Learning JavaScript Design Patterns](https://www.patterns.dev/posts/classic-design-patterns/)

[^ob_scope_closure]: [前端面试指南：作用域和闭包](https://mitianyi.gitbook.io/frontend-interview-guide/javascript-basics/scope-and-closure)
