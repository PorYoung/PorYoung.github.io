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

1. 任何变量，如果未经声明就赋值，此变量是属于 window 的属性，而且不会做变量提升。（注意，无论在哪个作用域内赋值）

```javascript
function foo() {
	var a = (b = 100); // a和b的区别
}
```
