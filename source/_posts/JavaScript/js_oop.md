---
title: "JS 面向对象编程"
date: "2022-06-20 20:44:47"
categories:
  - "FrontEnd"
tags:
  - "JavaScript"
  - "OOP"
  - "notes"
---

## 对象创建

1. `{}`对象字面量

2. 工厂模式

```javascript
/*
 * 使用工厂方法创建对象
 *  通过该方法可以大批量的创建对象
 */
function createPerson(name, age, gender) {
  //创建一个新的对象
  var obj = new Object();
  //向对象中添加属性
  obj.name = name;
  obj.age = age;
  obj.gender = gender;
  obj.sayName = function () {
    alert(this.name);
  };
  //将新的对象返回
  return obj;
}

var obj2 = createPerson("猪八戒", 28, "男");
var obj3 = createPerson("白骨精", 16, "女");
var obj4 = createPerson("蜘蛛精", 18, "女");
```

3. 构造函数
   - 构造函数需要使用 `new` 关键字来调用才有意义
   - 以构造函数的形式调用时，`this` 指向新创建的实例对象
   - 静态成员是构造函数的属性和方法，通过构造函数访问：`Person.prototype`
   - 实例成员是实例化对象的属性和方法，通过实例化对象访问

```javascript
// 创建一个构造函数，专门用来创建Person对象
function Person(name, age, gender) {
  this.name = name;
  this.age = age;
  this.gender = gender;
  this.sayName = function () {
    alert(this.name);
  };
}

var per = new Person("孙悟空", 18, "男");
var per2 = new Person("玉兔精", 16, "女");
var per3 = new Person("奔波霸", 38, "男");

// 创建一个构造函数，专门用来创建 Dog 对象
function Dog() {}

var dog = new Dog();
```

## 浅拷贝、深拷贝

1. 浅拷贝的推荐实现：`Object.assign`

## 原型和原型链

![原型和原型链](https://qinu.poryoung.cn/img/202206221756324.png)

1. `__proto__` 是非标准属性，建议使用 ES6 新增的 `Reflect.getPrototypeOf` 和 `Object.setPrototypeOf`
2. `Function.__proto__`等于`Function.prototype`

### 处理原型链污染

1. 检测`constructor`、`__proto__`这些敏感键值
2. 使用`Object.create(null)`创建原型为`null`的对象，保证对原型的修改无效
3. 使用`Object.freeze()`冻结对象
4. [ ] 建立 JSON schema ，在解析用户输入内容时，通过 JSON schema 过滤敏感键名
5. 规避不安全的递归性合并

### 原型链继承

原型链继承->组合继承->寄生组合继承。

#### 原型链继承

通过修改子类构造函数原型为父类构造函数实例实现。

存在的问题：

1. 在创建子类实例的时候，不能向超类型的构造函数中传递参数
2. 这样创建的子类原型会包含父类的实例属性，造成引用类型属性同步修改的问题

#### 组合继承

使用`call`在子类构造函数中调用父类构造函数解决原型链继承的问题。

存在的问题：

1. 父类的构造函数被调用了两次（创建子类原型时调用了一次，创建子类实例时又调用了一次），导致子类原型上会存在父类实例属性，浪费内存

#### 寄生组合继承

使用 `Object.create(Parent.prototype)` 创建一个新的原型对象赋予子类从而解决组合继承的缺陷。

```javascript
// 寄生组合继承实现

function Parent(value) {
  this.value = value;
}

Parent.prototype.getValue = function () {
  console.log(this.value);
};

function Child(value) {
  Parent.call(this, value);
}

Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false, // 不可枚举该属性
    writable: true, // 可改写该属性
    configurable: true, // 可用 delete 删除该属性
  },
});

const child = new Child(1);
child.getValue();
child instanceof Parent;
```

### 继承关系判断

1. `instanceof`

`instanceof` 本质上是通过原型链查找来判断继承关系的，因此只能用来判断引用类型，对基本类型无效。

2. `Object.prototype.isPrototypeOf`
