---
title: "【转】配置Nginx做Node.js应用的反向代理 (HTTPS)"
date: "2018-04-13"
categories: 
  - "notes-summary"
tags: 
  - "nginx"
  - "node-js"
  - "ubuntu"
---

### 【原文】[配置Nginx做Node.js应用的反向代理 (HTTPS)](http://blog.topspeedsnail.com/archives/4982)

#### 安装Node.js

用PPA你可以的到最新版本的node.js

执行如下命令安装PPA

```null
curl -sL https://deb.nodesource.com/setup | sudo bash -
```

安装 node.js:

```null
sudo apt-get install nodejs npm
```

为了使一些npm包正常工作（例如需要从源码构建的包），你需要安装 build-essentials 包：

```null
$ sudo apt-get install build-essential
```

#### 创建一个简单的Node.js应用

- 更优雅的启动node.js应用：[PM2: 管理Node.js应用进程](http://blog.topspeedsnail.com/archives/4985)

#### 配置Nginx做为反向代理

**安装Nginx**

**编辑配置文件**

```null
sudo vim /etc/nginx/sites-available/default
```

**把文件中的内容替换为：**

```null
server {
    listen 80;

    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**重启nginx**

#### 添加HTTPS支持（使用免费的Let’s Encrypt）

**从github clone源码：**

```null
sudo apt-get -y install git bc
sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
```

**获得SSL证书：** 由于Let’s Encrypt要使用80端口做认证，所以需要暂停Nginx的运行：

```null
sudo systemctl stop nginx
```

**获得证书：**

```null
cd /opt/letsencrypt
./letsencrypt-auto certonly --standalone
```

根据提示提供你的信息，包括域名、邮箱啥的。

执行成功之后，证书保存到了`/etc/letsencrypt/your_domain/`

**配置Nginx：**

```null
sudo vim /etc/nginx/sites-enabled/default
```

把内容替换为：

```null
# HTTP - 把HTTP请求转向到HTTPS:
server {
        listen 80;
        listen [::]:80 default_server ipv6only=on;
        return 301 https://$host$request_uri;
}

# HTTPS - 反向代理
server {
        listen 443;
        server_name your_domain.com;

        ssl on;
        # Let's Encrypt生成的SSL证书:
        ssl_certificate /etc/letsencrypt/live/your_domain/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your_domain/privkey.pem;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

        # 把请求转到localhost:8081:
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:8081/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }
}
```

注意替换上面的域名、证书路径等信息。

**再次启动nginx**

#### 关于Let’s Encrypt证书的更新，看如下帖：

[Ubuntu 16.04安装配置Nginx使用Let’s Encrypt](http://topspeedsnail.com/ubuntu-nginx-let-encrypt/)
