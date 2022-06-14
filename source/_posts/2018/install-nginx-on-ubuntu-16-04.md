---
title: "Install Nginx On Ubuntu 16.04"
date: "2018-04-13"
categories: 
  - "notes-summary"
tags: 
  - "nginx"
  - "notes"
  - "ubuntu"
---

#### 【原文】[How To Install Nginx on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)

#### install nginx

Nginx is available in Ubuntu's default repositories, so the installation is rather straight forward.

```null
sudo apt-get update
sudo apt-get install nginx
```

#### Adjust the Firewall (use `ufw`)

get a listing of the application profiles

```null
sudo ufw app list
```

```null
//Output
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

enable

```null
sudo ufw allow 'Nginx HTTP'
```

verify

```null
sudo ufw status
```

#### Check your Web Server

```null
systemctl status nginx
```

#### Manage the Nginx Process

```null
sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl restart nginx
//If you are simply making configuration changes, Nginx can often reload without dropping connections. To do this, this command can be used:
sudo systemctl reload nginx
```

By default, Nginx is configured to start automatically when the server boots. If this is not what you want, you can disable this behavior by typing:

```null
sudo systemctl disable nginx
```

To re-enable the service to start up at boot, you can type:

```null
sudo systemctl enable nginx
```

#### Get Familiar with Important Nginx Files and Directories

**Content** `/var/www/html`: The actual web content, which by default only consists of the default Nginx page you saw earlier, is served out of the `/var/www/html` directory. This can be changed by altering Nginx configuration files.

**Server Configuration** `/etc/nginx`: The Nginx configuration directory. All of the Nginx configuration files reside here.

`/etc/nginx/nginx.conf`: The main Nginx configuration file. This can be modified to make changes to the Nginx global configuration.

`/etc/nginx/sites-available/`: The directory where per-site "server blocks" can be stored. Nginx will not use the configuration files found in this directory unless they are linked to the sites-enabled directory (see below). Typically, all server block configuration is done in this directory, and then enabled by linking to the other directory.

`/etc/nginx/sites-enabled/`: The directory where enabled per-site "server blocks" are stored. Typically, these are created by linking to configuration files found in the sites-available directory.

`/etc/nginx/snippets`: This directory contains configuration fragments that can be included elsewhere in the Nginx configuration. Potentially repeatable configuration segments are good candidates for refactoring into snippets.

**Server Logs** `/var/log/nginx/access.log`: Every request to your web server is recorded in this log file unless Nginx is configured to do otherwise.

`/var/log/nginx/error.log`: Any Nginx errors will be recorded in this log.
