---
title: "Node版本切换"
date: "2018-06-03"
categories: 
  - "notes"
tags: 
  - "node-js"
  - "notes"
---

#### In the lastest nodejs version the Buffer() constructor has been deprecated

> DEP0005: Buffer() constructor# Type: Runtime (supports --pending-deprecation) The Buffer() function and new Buffer() constructor are deprecated due to API usability issues that can potentially lead to accidental security issues. As an alternative, use of the following methods of constructing Buffer objects is strongly recommended: Buffer.alloc(size\[, fill\[, encoding\]\]) - Create a Buffer with initialized memory. Buffer.allocUnsafe(size) - Create a Buffer with uninitialized memory. Buffer.allocUnsafeSlow(size) - Create a Buffer with uninitialized memory. Buffer.from(array) - Create a Buffer with a copy of array Buffer.from(arrayBuffer\[, byteOffset\[, length\]\]) - Create a Buffer that wraps the given arrayBuffer. Buffer.from(buffer) - Create a Buffer that copies buffer. Buffer.from(string\[, encoding\]) - Create a Buffer that copies string. As of v10.0.0, a deprecation warning is printed at runtime when --pending-deprecation is used or when the calling code is outside node\_modules in order to better target developers, rather than users.

#### how to switch diffirent versions

**use module n**

```
npm install n -g
```

Use`sudo n version`to install specific version

And use `sudo n`to switch

Howerver if you try to install a older version while a new version has been installed, the new one will be uninstalled.

**what if n doesn't work** One reason causing this maybe the diffirence between n's path, which is `/usr/local` and node's installtion path, while you can use `which node` to check.

Then you can set environment value to solve this problem.

For more, [read this](http://www.jb51.net/article/98153.htm).
