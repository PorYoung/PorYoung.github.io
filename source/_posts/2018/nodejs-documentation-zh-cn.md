---
title: "Nodejs Documentation (zh-cn)"
date: "2018-02-15"
categories: 
  - "nodejs-docs-zh-cn"
tags: 
  - "documentation"
  - "node-js"
  - "translation"
---

## Docs

### 关于文档

网站上有如下几种类型的文档：

- API参考文档
- ES6特性
- 常见问题解答
- 指引

#### API参考文档

API参考文档提供了Node.js中函数或对象的详细信息。文档指出了每一个方法接受的参数，返回值以及可能出现的错误，同时也声明了其在Node.js不同版本中是否可用。

文档详细描述了Node.js提供的内嵌模块，未介绍社区提供的模块。

> 寻找之前发布的API文档？
> 
> - [Node.js 7.x](https://nodejs.org/docs/latest-v7.x/api/)
>     
> - [Node.js 5.x](https://nodejs.org/docs/latest-v5.x/api/)
>     
> - [Node.js 4.x](https://nodejs.org/docs/latest-v4.x/api/)
>     
> - [Node.js 0.12.x](https://nodejs.org/docs/latest-v0.12.x/api/)
>     
> - [Node.js 0.10.x](https://nodejs.org/docs/latest-v0.10.x/api/)
>     
> - [全部版本](https://nodejs.org/docs/)
>     

#### ES6特性

ES6文档部分描述了3个ES6功能组，详细说明了Node.js默认支持的特性，并配上说明链接。文档也说明了如何寻找带有特定Node.js版本的V8版本

#### 指南

深入了解关于Node.js技术上的特性和性能的文章

## ES6 and beyong

### ECMAScript 2015 (ES6) 及更高版本

Node.js依[现代V8引擎](https://developers.google.com/v8/)搭建。通过保持与V8引擎最新发布版的同步更新，我们确保将[JavaScript ECMA-262 specification](http://www.ecma-international.org/publications/standards/Ecma-262.htm)的新特性即时带给Node.js开发者，同时不断地提高性能和稳定性。

所有ECMAScript 2015特性被分为装载(**shipped**)、暂定(**staged**)和开发中（**in progress**)三组：

- 所有V8认为稳定并为Node.js默认支持的特性运行时不需要任何标记
    
- V8团队认为不稳定的即将完成的特性运行时需要标记:`--harmony`
    
- 虽然开发中的特性能单独被他们各自的和谐标记激活，但除了作测试用途，非常不鼓励这么做。提醒：这些标志由V8提供，可能会发生变化并且不作通知。
    

#### 不同特性对应默认装载在哪些Node.js版本？

[node.green](http://node.green/)网站提供了对Node.js各版本中支持的ECMAScript特性的精彩概述，及基于kangax的兼容表格。

#### 哪些功能正在开发？

新特性正持续被添加到V8引擎中。一般而言，我们希望能在将来的Node.js发布版中支持这些特性，虽然时间尚未可知。

在每一个Node.js发布版中你都可以通过参数`--v8-options`使用`grep`列出所有正在开发的功能。请注意，这些是尚未完成的并可能造成V8引擎崩溃的特性，若使用请自负风险。

`node --v8-options | grep "in progress"`

#### 每一个特性的性能如何？

V8团队持续努力提到新语言特性的性能以最终与原生EcmaScript 5及更早版本达到平衡。（注①:原文：**to eventually reach parity with their transpiled or native counterparts in EcmaScript 5 and earlier.**） 在网站[six-speed](https://fhinkel.github.io/six-speed)上能跟踪当前进度，并展示了ES2015和未来ES版本与原生ES5特性比较。

ES2015及后续版本引入优化特性的工作经由[performance plan](https://docs.google.com/document/d/1EA9EbfnydAmmU_lM8R_uEMQ-U_v4l9zulePSBkeYWmY)协调。V8团队收集并协调需要改进的地方，并设计文档解决问题。

#### 我搭建架构以使用`--harmony`标志。我应该移除它吗？

当前`--harmony`标志仅用于启用Node.js暂定(**staged**)的特性。毕竟，它现在与`--es_staging`相同。以上所提及的已完成的特性尚未确定其稳定性。如果你想要运行的安全，尤其是在生产环境中，考虑在V8默认装载前移除运行标志。如果你保持开启，你应该做好准备如果在将来Node.js的更新中V8改变了它们的含义以更贴近标准可能会破坏你的代码。

#### 我如何寻找V8哪个版本带有特定的Node.js版本？

Node.js提供了一个简单方法，通过`process`全局对象列出所有依赖和各自带有的特定二进制文件。如果是V8引擎，在你的终端输入以下命令以检索它的版本。

`node -p process.versions.v8`

## Inspector

### 调试Node.js应用

许多工具和库能够帮助你调试你的Node.js应用。以下列出部分工具。

手动连接而不使用工具，传入`--inspect`参数并连接输出的URL。

如果一个进程不带`--inspect`启动，用`SIGUSR1`发送信号以激活调试器并打印链接URL。

* * *

### 审查工具和客户端

这些商业或开源工具使得Node.js应用调试更加容易。

#### [node-inspect](https://github.com/nodejs/node-inspect)

- 一个命令行界面调试器在[https://github.com/nodejs/node-inspect](https://github.com/nodejs/node-inspect)开发
    
- 与Node.js捆绑，使用`node inspect myscript.js`启动
    
- 也能使用`npm insatll -g node-inspect`独立安装，使用使用`node inspect myscript.js`启动
    

#### [Chrome DevTools](https://github.com/ChromeDevTools/devtools-frontend)

- **选项一：**在谷歌浏览器打开`chrome://inspect`。点击**Open dedicated DevTools for Node**的链接。
    
- **选项二：**安装谷歌扩展**NIM (Node Inspector Manager)** [Extension link](https://chrome.google.com/webstore/detail/nim-node-inspector-manage/gnhhdgbaldcilmgcpfddgdbkhjohddkj)
    

#### [VS Code](https://github.com/microsoft/vscode) 1.10+

- 在调试面版，点击设置图标以打开`.vscode/launch.json`。选择**Node.js**以初始安装。

#### [Visual Studio](https://github.com/Microsoft/nodejstools)

- 在菜单中选择**Debug > Start Dubgging**或者按**F5**
    
- [详细指导](https://github.com/Microsoft/nodejstools/wiki/Debugging)
    

#### [JetBrains WebStrom](https://www.jetbrains.com/webstorm/) 2017.1+ and other JetBrains IDEs

- 创建新的Node.js调试配置

#### [谷歌远程接口(chrome-remote-interface)](https://github.com/cyrus-and/chrome-remote-interface)

- 工具库以减少与Inspector Protocol端的连接

* * *

### 命令行选项

以下列表列出对调试起重要作用的几个**runtime flags**

| **Flag** | **Meaning** |
| :-: | --- |
| `--inspect` | \* 启用监视器代理 |
|  | \* 监听默认地址和端口(127.0.0.1:9229) |
| `--inspect=[host:port]` | \* 启用监视器代理 |
|  | \* 绑定地址或者主机名（默认：127.0.0.1） |
|  | \* 监听端口（默认：9229） |
| `--inspect-brk` | \* 启用监视器代理 |
|  | \* 监听默认地址和端口（127.0.0.1：9229） |
|  | \* 在用户代码开始前停止 |
| `--inspect-brk=[host:port]` | \* 启用监视器代理 |
|  | \* 绑定地址或主机名（默认：127.0.0.1） |
|  | \* 监听端口（默认：9229） |
|  | \* 在用户代码开始前停止 |
| `node inspect script.js` | \* 产生子进程以`--inspect`运行用户脚本，使用主进程运行命令行界面调试器 |

## [Node.js v8.9.4 Documentation](/node-js-v8-9-4-documentation-zh-cn/)
