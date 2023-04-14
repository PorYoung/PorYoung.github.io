---
title: "JS Events"
date: "2022-06-28 19:05:26"
categories:
  - "FrontEnd"
tags:
  - "JavaScript"
  - "notes"
---

## 事件流

![picture 1](https://s2.loli.net/2022/06/28/phIXow3jVOKP9cJ.png)

### 事件捕获

捕获阶段，事件依次传递的顺序是：window --> document --> html--> body --> 父元素、子元素、目标元素

### 事件冒泡

以下事件不冒泡：blur、focus、load、unload、onmouseenter、onmouseleave，可以通过`event.bubbles`检查。

阻止冒泡：

```javascript
element.onclick = function (event) {
  //阻止冒泡
  event = event || window.event;

  if (event && event.stopPropagation) {
    event.stopPropagation();
  } else {
    // < IE10
    event.cancelBubble = true;
  }
};
```

## 事件委托

事件委托，是把一个元素响应事件（click、keydown......）的函数委托到另一个元素，如在父元素的响应函数中处理子元素的事件，事件委托利用了冒泡机制，减少了事件绑定的次数，减少内存消耗，提高性能。

focus、blur 之类的事件本身没有事件冒泡机制，所以无法委托。

mousemove、mouseout 这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高，因此也是不适合于事件委托的。

```javascript
// https://zhuanlan.zhihu.com/p/26536815
function eventDelegate(parentSelector, targetSelector, events, foo) {
  // 触发执行的函数
  function triFunction(e) {
    // 兼容性处理
    var event = e || window.event;

    // 获取到目标阶段指向的元素
    var target = event.target || event.srcElement;

    // 获取到代理事件的函数
    var currentTarget = event.currentTarget;

    // 处理 matches 的兼容性
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(
              s
            ),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    // 遍历外层并且匹配
    while (target !== currentTarget) {
      // 判断是否匹配到我们所需要的元素上
      if (target.matches(targetSelector)) {
        var sTarget = target;
        // 执行绑定的函数，注意 this
        foo.call(sTarget, Array.prototype.slice.call(arguments));
      }

      target = target.parentNode;
    }
  }

  // 如果有多个事件的话需要全部一一绑定事件
  events.split(".").forEach(function (evt) {
    // 多个父层元素的话也需要一一绑定
    Array.prototype.slice
      .call(document.querySelectorAll(parentSelector))
      .forEach(function ($p) {
        $p.addEventListener(evt, triFunction);
      });
  });
}

eventDelegate("#list", "li", "click", function () {
  console.log(this);
});
```

## DOM2 的写法：addEventListener

`addEventListener(type, listener, ?option)`

- 参数 3：true 表示捕获阶段触发，false 表示冒泡阶段触发（默认）。如果不写，则默认为 false。
- 可以绑定多个响应函数，执行顺序是：事件被触发时，响应函数会按照函数的绑定顺序执行。
- `addEventListener()`中的 `this`，是绑定事件的对象
