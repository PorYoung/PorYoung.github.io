---
title: "【转】Nginx实现端口转发"
date: "2018-08-19"
categories: 
  - "notes-summary"
tags: 
  - "https"
  - "nginx"
---

[查看原文：Nginx 实现端口转发——星河赵博客](https://www.cnblogs.com/zhaoyingjie/p/7248678.html)

### Summary

Nginx在监听某一端口（如80端口）时，通过配置负载均衡池，根据不同的域名，将同一端口的HTTP/HTTPS请求分发到不同的端口。

实例如下：

```nginx
##负载均衡池
upstream one_pool{
    server 127.0.0.1:5000;
}
upstream two_pool{
    server 127.0.0.1:6000;
}

##server one
server {
    #listenning on 80
    listen 80;
    server_name one.poryoung.cn;
    #redirect to https
    return 301 https://$server_name$request_uri;
}
server {
    listen 443;
    server_name one.poryoung.cn;
    location / {
        proxy_pass http://one_pool;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    #Allow HTTPS
    ssl on;
    # Let's Encrypt生成的SSL证书:
    ssl_certificate /.../*.poryoung.cn/fullchain.cer;
    ssl_certificate_key /.../*.poryoung.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
}
##server two
server {
    #listenning on 80
    listen 80;
    server_name two.poryoung.cn;
    #redirect to https
    return 301 https://$server_name$request_uri;
}
server {
    listen 443;
    server_name two.poryoung.cn;
    location / {
        proxy_pass http://two_pool;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    #Allow HTTPS
    ssl on;
    # Let's Encrypt生成的SSL证书:
    ssl_certificate /.../*.poryoung.cn/fullchain.cer;
    ssl_certificate_key /.../*.poryoung.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
}
```

其中的域名和证书部分需要替换。

Let's Encrypt已经支持**泛域名**证书申请，网上有许多教程，比较详细的如[Let’s Encrypt免费泛域名证书申请教程步骤](https://www.xxorg.com/archives/4870)，使用`ACME.sh`申请。

在申请过程中，`./acme.sh --issue -d *.xxorg.com -d xxorg.com --dns`和`./acme.sh --renew -d *.xxorg.com -d xxorg.com`命令可能会遇到`dns manual mode`警告而失败的情况，在其后加上`--yes-I-know-dns-manual-mode-enough-go-ahead-please`即可
