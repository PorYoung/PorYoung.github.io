---
title: "win10搜索失效解决方法"
date: "2018-09-27"
categories: 
  - "notes-summary"
tags: 
  - "tips"
  - "win10"
---

> 答案来自[知乎提问](https://www.zhihu.com/question/35197845)

#### 方法1. 重新安装Cortana

以管理员模式运行powershell，输入以下内容并确认

```bash
Get-AppXPackage -Name Microsoft.Windows.Cortana | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\AppXManifest.xml"}
```

#### 方法2. 扫描修复系统

以管理员模式运行powershell，键入并回车

```bash
sfc /scannow
```

#### 方法3. 重新运行资源管理器explorer.exe
