---
title: "SSE：服务器发送事件"
date: "2019-04-22"
categories: 
  - "notes"
tags: 
  - "http"
  - "sse"
---

传统的网页都是浏览器向服务器“查询”数据，但是很多场合，最有效的方式是服务器向浏览器“发送”数据。比如，每当收到新的电子邮件，服务器就向浏览器发送一个“通知”，这要比浏览器按时向服务器查询（polling）更有效率，服务器发送事件（Server-Sent Events，简称SSE）就是为了解决这个问题，而提出的一种新API，部署在EventSource对象上。目前，除了IE，其他主流浏览器都支持。

[转：SSE：服务器发送事件,使用长链接进行通讯](https://www.cnblogs.com/goody9807/p/4257192.html)
