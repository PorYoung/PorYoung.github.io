---
title: "How to build MCloud"
date: "2018-08-22"
categories: 
  - "notes-summary"
tags: 
  - "mcloud"
---

随着各大网盘关闭和被墙，网络云盘可选的服务商越来越少，某度云收费太高，限制太多，加上某些个人资料不便上传，此时私有云的作用就凸显出来了，搭配离线下载工具和同步工具，一个比较完整成熟的云应用就呈现出来了

# LNMP

预置环境配置`LNMP`（或`LAMP`），可使用一键安装包，也可以自己逐个安装配置

# KodExplorer

对比使用`OwnCloud`和`NextCloud`后，个人感觉`KodExplorer`功能更加强大，也比较稳定，在WEB能像`windows`一样操作，此外`KodExplorer`无需配置数据库（后续可能将支持数据库），安装便利。唯一不足的，`KodExplorer`移动端支持不友好（后续也将支持移动端）。

[官方演示Demo](http://demo.kodcloud.com/)，用户名/密码均为demo

[官方下载页面](https://kodcloud.com/download/)

在Linux中安装:

移至需要安装`KodExplorer`的web目录，如`/var/www/KodExplorer`，请手动更改至最新版本号：

```bash
cd /var/www/KodExplorer
wget http://static.kodcloud.com/update/download/kodexplorer4.32.zip
unzip kodexplorer4.32.zip
chmod -Rf 777 ./*
```

配置好`Nginx`和`PHP`后，访问服务器，设置密码即可登陆使用，默认有三个账户`admin`、`demo`、`guest`。

# Aria2

## Aria2后台

Ubuntu 16.04直接使用`apt`安装：

```bash
apt-get install aria2
```

可以直接使用命令行参数设置配置并启动，也可以创建并编辑配置文件`aria2.conf`，可参考如下：

```bash
#用户名
#rpc-user=user
#密码
#rpc-passwd=passwd
#上面的认证方式不建议使用,建议使用下面的token方式
#设置加密的密钥
rpc-secret=XXXXXX
#允许rpc
enable-rpc=true
#允许所有来源, web界面跨域权限需要
rpc-allow-origin-all=true
#允许外部访问，false的话只监听本地端口
rpc-listen-all=true
#RPC端口, 仅当默认端口被占用时修改
rpc-listen-port=6800
#最大同时下载数(任务数), 路由建议值: 3
max-concurrent-downloads=5
#断点续传
continue=true
#同服务器连接数
max-connection-per-server=16
#最小文件分片大小, 下载线程数上限取决于能分出多少片, 对于小文件重要
min-split-size=10M
#单文件最大线程数, 路由建议值: 5
split=16
#下载速度限制
max-overall-download-limit=0
#单文件速度限制
max-download-limit=0
#上传速度限制
max-overall-upload-limit=0
#单文件速度限制
max-upload-limit=0
#断开速度过慢的连接
#lowest-speed-limit=0
#验证用，需要1.16.1之后的release版本
#referer=*
#文件保存路径, 默认为当前启动位置
dir=/var/www/html/downloads/
#禁用IP V6
disable-ipv6=true

## BT/PT下载相关 ##
# 当下载的是一个种子(以.torrent结尾)时, 自动开始BT任务, 默认:true
#follow-torrent=true
# BT监听端口, 当端口被屏蔽时使用, 默认:6881-6999
#listen-port=51413
# 单个种子最大连接数, 默认:55
#bt-max-peers=55
# 打开DHT功能, PT需要禁用, 默认:true
enable-dht=false
# 打开IPv6 DHT功能, PT需要禁用
#enable-dht6=false
# DHT网络监听端口, 默认:6881-6999
#dht-listen-port=6881-6999
# 本地节点查找, PT需要禁用, 默认:false
#bt-enable-lpd=false
# 种子交换, PT需要禁用, 默认:true
enable-peer-exchange=false
# 每个种子限速, 对少种的PT很有用, 默认:50K
#bt-request-peer-speed-limit=50K
# 客户端伪装, PT需要
peer-id-prefix=-TR2770-
user-agent=Transmission/2.77
# 当种子的分享率达到这个数时, 自动停止做种, 0为一直做种, 默认:1.0
seed-ratio=0
# 强制保存会话, 即使任务已经完成, 默认:false
# 较新的版本开启后会在任务完成后依然保留.aria2文件
#force-save=false
# BT校验相关, 默认:true
#bt-hash-check-seed=true
# 继续之前的BT任务时, 无需再次校验, 默认:false
bt-seed-unverified=true
# 保存磁力链接元数据为种子文件(.torrent文件), 默认:false
bt-save-metadata=true
#添加额外的tracker
bt-tracker=udp://tracker1.wasabii.com.tw:6969/announce,udp://tracker2.wasabii.com.tw:6969/announce,http://mgtracker.org:6969/announce,http://tracker.mg64.net:6881/announce,http://share.camoe.cn:8080/announce,udp://tracker.opentrackr.org:1337/announce
```

保存并使用该配置启动：`aria2c --conf-path=aria2.conf` 可使用`Screen`后台运行:

```bash
#创建aria2c活动
screen -S aria2c
#运行aria2c
aria2c --conf-path=aria2.conf
#使用ctrl+d再按a离开，使用screen -r aria2c重新进入该活动
```

## Aria2前端

可使用`aria2 WebUI`也可使用UI更加好看（个人感觉）的`aria-Ng`

`aria-Ng`项目地址：`https://github.com/mayswind/AriaNg` `aria-Ng`下载地址：`https://github.com/mayswind/AriaNg/releases`

和`KodExplorer`类似，解压到WEB目录，配置好后访问域名或IP

![](https://blog.poryoung.cn/wp-content/uploads/2018/08/1e34e061abeb5639ff1772ace9067e95.png)

填好RPC密钥连接即可

> p.s. 在使用aria2 WebUI时遇到点问题，使用https访问会连接失败，即使开启了SSL/TLS，使用http访问并使用SSL连接可正常使用 在aria-Ng没有这个问题，不知道是不是配置的问题

# Syncthing同步神器

光有云盘和离线下载还不够，没有云备份和云同步功能还不能称得上MCloud，这里推荐目前仍然存活的同步神器Syncthing，随时随地任何设备间进行同步。

Github下载地址：`https://github.com/syncthing/syncthing/releases/tag/v0.14.49`，根据不同的客户端下载

Ubuntu 16.04下载后并解压，复制其中的`syncthing`可执行文件到系统环境目录，首次运行将创建配置文件，然后结束进程，编辑配置文件：

```bash
vim ~/.config/syncthing/config.xml
```

找到如下几行并修改`address`为`0.0.0.0:8384`端口随意：

```markup
<gui enabled="true" tls="false" debugging="false">
    <address>127.0.0.1:8384</address>
    <apikey>2GeGJK9z6tXKP3nHJYU56ZHoYSYnqQ9S</apikey>
    <theme>default</theme>
</gui>
```

注意防火墙，需要开启端口

若要用域名访问可以用Nginx做反向代理，[见这里：Nginx端口转发](https://blog.poryoung.cn/?p=929)

访问后即可查看设备ID，用于连接其他设备，同时可设置共享文件夹（不同设备相同文件夹ID会自动共享）

window端可下载官方提供的工具方便管理[SyncTrayzor](https://github.com/canton7/SyncTrayzor/releases/tag/v1.1.21)

Android和IOS同样有客户端，可以设置共享

此外Syncthing还支持版本管理。

# OSS

不管是国内还是国外，VPS存储容量还是有限的，这个时候可以考虑使用OSS进行挂载，目前阿里云夏日活动，1TB存储3年只要99元

挂载方法可以查看阿里云详细教程
