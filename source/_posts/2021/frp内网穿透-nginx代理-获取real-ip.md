---
title: "FRP内网穿透 + Nginx代理 + 获取Real IP"
date: "2021-01-10"
categories: 
  - "notes-summary"
tags: 
  - "frp"
  - "nginx"
  - "内网穿透"
---

# FRP内网穿透 + Nginx代理 + 获取真实IP

以下仅列出关键配置

## 外网服务端配置

如果指定反代ip，frp会无法获取host，导致502错误，采用以下方案可以解决，但需要开放`fprs https`端口，并指定解析`$host`的DNS服务器

### Nginx

```nginx
server {
    listen 443 ssl;
    server_name your.domain;

    ssl_certificate  ./your.domain.cer;
    ssl_certificate_key ./your.domain.key;
    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;
    server_tokens off;

    location / {
        resolver 223.5.5.5; # dns resolver server
        proxy_ssl_server_name on;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass https://$host:6443; # frps https port, set $host insead of ip
        error_page 502 http://$host:6080/$request_uri;
    }
}
```

> 参考[issue #888: nginx https反向代理到frp https 报 502错误](https://github.com/fatedier/frp/issues/888) 参考[frpc+frps+nginx反代+解析后端真实IP+双向https自动跳转+https证书配置的纯享版配置文件及操作指导](https://blog.ray8.cc/archives/frpc-frps-nginx-real-ip-https-rewrite-ssl-cert-pure-code.html/comment-page-1)

### FRP Server

```shell
# [common] is integral section
[common]
# A literal address or host name for IPv6 must be enclosed
# in square brackets, as in "[::1]:80", "[ipv6-host]:http" or "[ipv6-host%zone]:80"
bind_addr = 0.0.0.0
bind_port = 5443
# udp port used for kcp protocol, it can be same with 'bind_port'
# if not set, kcp is disabled in frps
kcp_bind_port = 5443
# if you want to configure or reload frps by dashboard, dashboard_port must be set
dashboard_port = 8090
# dashboard assets directory(only for debug mode)
dashboard_user = admin
dashboard_pwd = admin
# assets_dir = ./static
vhost_http_port = 6080
vhost_https_port = 6443
# console or real logFile path like ./frps.log
log_file = ./frps.log
# debug, info, warn, error
log_level = info
log_max_days = 3
# auth token
token = Your_Token
# It is convenient to use subdomain configure for http、https type when many people use one frps server together.
subdomain_host = your.domain
# only allow frpc to bind ports you list, if you set nothing, there won't be any limit
#allow_ports = 1-65535
# pool_count in each proxy will change to max_pool_count if they exceed the maximum value
max_pool_count = 50
# if tcp stream multiplexing is used, default is true
tcp_mux = true
```

## 本地客户端配置

### Nginx

```nginx
server
{
    listen 80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name 172.31.0.1; # local server ip

    set_real_ip_from 172.31.0.1; # frp client ip
    real_ip_header X-Forwarded-For; #用于接收远端frps服务器上nginx传递的真实IP
    real_ip_recursive on;

    ssl_certificate    ./your.domain.cer;
    ssl_certificate_key    ./your.domain.key;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    add_header Strict-Transport-Security "max-age=31536000";
    error_page 497  https://$host$request_uri;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://application; # your local application ip
    }
}
```

### FRP Client

```shell
[common]
token = Your_Token
server_addr = server_host
server_port = 5443

[index]
type = https
local_ip = 172.31.0.1
local_port = 443
custom_domains = your.domain
use_encryption=true
use_compression=true
```

## 获取IP

以`django`为例：

```python
def get_ip_address(request):
    ip = request.META.get('HTTP_X_REAL_IP', "")
    if not ip:
        ip = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if not ip:
        ip = request.META.get('REMOTE_ADDR', "")
    client_ip = ip.split(",")[-1].strip() if ip else ""
    return client_ip
```
