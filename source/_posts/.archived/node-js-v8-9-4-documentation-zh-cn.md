---
title: "Node.js v8.9.4 Documentation zh-cn"
date: "2018-02-15"
categories: 
  - "docs"
---

## 关于文档

本文档的目标是从参考和概念角度全面解释Node.js的API，每一章节描述一个内嵌模块或者高级思想。

在合适的情况下，提供给事件处理的属性类型，方法参数和参数会在主题标题下逐条列出。

每个`.html`文档都有相应的`.json`文档，以结构化方式呈现相同的内容。这一功能是实验性的，是为使那些希望用文档做些编程工作的IDE和其它工具受益而添加的。

每一个`.html`和`.json`文件都是基于Node.js源码树中`doc/api`文件夹中相应的`.md`文件生成的。该文档使用`tools/doc/generate.js`程序生成。HTML模板位于`doc/template.html`。

如果文档有误，请[提交问题](https://github.com/nodejs/node/issues/new)或者查看[投稿指南](https://github.com/nodejs/node/blob/master/CONTRIBUTING.md)以了解如何提交补丁。

### 稳定指数

文档每个章节都有稳定性标志。Node.js API仍然在做少许改动，随着它的成熟，API将更加可靠。一些被证实的、可靠的API几乎不大可能会变化，其它新增的，实验性的或者已知有危险的都在被重新设计的过程中。

稳定指数如下：

稳定度：0 -不赞成使用 该功能已知存在问题，可能计划进行更改。不要依赖它。使用它会导致发出警告。不应期望其向后兼容主要版本。

稳定度：1 -试验性的 此功能仍在积极开发中，在将来版本中可能受不向后兼容，甚至移除的影响。不建议在生产环境使用。

稳定度：2 -稳定的 这部分API被证明是良好的。与npm生态系统兼容性是最高优先级，除非绝对必要，否则不会发生变化

### JSON输出

稳定度：1 -试验性的

每个通过markdown生成的HTML文件都有一个对应的具有相同数据的JSON文件。

这个特性是 Node.js v0.6.12 新增的。该特性是试验的。

### 系统调用和帮助页

系统调用定义了用户程序和底层系统之间的接口，例如[open(2)](http://man7.org/linux/man-pages/man2/open.2.html)和[read(2)](http://man7.org/linux/man-pages/man2/read.2.html)。Node函数简单封装了系统调用函数，例如`fs.open()`。相应的文档会描述系统调用如何工作。

提示：有些系统调用是BSD系统特有的，比如[lchown(2)](http://man7.org/linux/man-pages/man2/lchown.2.html)。这意味着它只能在macOs和其它BSD衍生系统运行。不能在Linux系统上运行。

大多数Unix系统调用都有相应Windows版本，但Windows版本运行起来可能与Linux和macOS版本有差异。有时Unix系统调用不能在Windows上找到相应的语义版本。详见[议题4760](https://github.com/nodejs/node/issues/4760)

## 使用及示例

### 使用方式

`node [options] [v8 options] [script.js | -e "script" | - ] [arguments]`

请参考[命令行选项](https://nodejs.org/dist/latest-v8.x/docs/api/cli.html#cli_command_line_options)文档查看使用Node.js运行脚本的不同选项和方式

### 示例

使用Node.js编写的web服务，响应**Hello World**：

```null
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

将以上代码放在`example.js`文件中，然后使用Node.js执行以启动服务：

```null
$ node example.js
Server running at http://127.0.0.1:3000/
```

文档中的所有示例都能以相似的方法运行。

## 断言(Assert)
