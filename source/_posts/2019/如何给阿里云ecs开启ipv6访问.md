---
title: "如何给阿里云ecs开启ipv6访问"
date: "2019-10-08"
categories: 
  - "notes"
---

[原文地址](https://www.bobobk.com/377.html)

阿里云centos镜像默认是把ipv6给注释掉的，如果要开启的话需要使用IPv4 和 IPv6 双栈网络，这需要申请公测资格，不是很方便，这里我们使用tunnelbroker提供的ipv6隧道来使其支持ipv6访问。而学校电信是可以直接获取ipv6地址的，如果阿里云服务器可以ipv6访问的话就可以免费上网了。

# 1.开启ipv6访问

```bash
vi /etc/sysctl.conf
```

把下面这3行内容注释去掉，把1替换成0，变成下图 ![ipv6](https://www.bobobk.com/wp-content/uploads/2019/07/ipv6.webp) 然后使用 _sysctl -p_ 重新载入，就可以支持ipv6了。

# 2.通过tunnelbroker获得ipv6地址

进入[https://tunnelbroker.net](https://tunnelbroker.net) 注册账号，密码要复杂的不然通不过。

登陆后选择左下角的create regular tunnel，

![create_tunnel](https://www.bobobk.com/wp-content/uploads/2019/07/create_tunnel.webp)

输入自己ecs的ip地址 注意ecs不能禁ping，否则tunnelbroker拒绝建立隧道。 ![icmp_block](https://www.bobobk.com/wp-content/uploads/2019/07/icmp_block.webp) 最下方点击create tunnel就建好了。 进入tunnel配置页面 ![ipv6_configure](https://www.bobobk.com/wp-content/uploads/2019/07/ipv6_configure-1.webp)

## 注意:此处地址必须改为阿里云的内网地址，否则外网无法连接，我的内网是172.19开头的

复制在bash下直接运行就可以了。

使用ifconfig查看网络配置，可以看到ipv6地址已经有了 ![ipv6_ok](https://www.bobobk.com/wp-content/uploads/2019/07/ipv6_ok.webp)

此时应该已经配置成功了，可以使用

```bash
wget -6 www.bobobk.com
```

测试下，如果成功返回内容那么就是ipv6配置成功了

# 3.修改nginx配置文件使网站可通过ipv6访问

注：如果使用cloudflare cdn的话是默认可以ipv6访问的 打开nginx配置文件，监听ipv6是\[::\]:80,\[::\]:443，修改后如下图 ![nginx_ipv6](https://www.bobobk.com/wp-content/uploads/2019/07/nginx_ipv6.webp)

至此，所有配置都完成了。

# 总结

> 本文从注册tunnelbroker开启ipv6开始，一步一步设置阿里云ecs 的centos7服务器，最终实现linux网系统对ipv6网站的访问。
