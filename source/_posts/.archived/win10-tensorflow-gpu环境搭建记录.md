---
title: "win10 TensorFlow GPU环境搭建记录"
date: "2018-10-17"
categories: 
  - "notes"
tags: 
  - "tensorflow"
---

# win10 TensorFlow GPU环境搭建记录

> By PorYoung 2018-10-17 [在CSDN查看](https://blog.csdn.net/qq_36624899/article/details/83118989)

## 机器配置

- win 10(64bit)
- GTX 960m

## 本次搭建所需文件

- VS2017
- CUDA
- cuDNN
- Anaconda

## 配置过程

1. 安装（已安装则选择修改单个组件）并配置vs2017，添加如下组件：
    
    - VC++ 2017版本 15.4 v14.11工具集
    - 用于CMake的Visual C++工具
    - 适用于桌面的VC++ 2015.3 V14.00(V140)工具集
        
        - 首次安装CUDA时出现Visual Studio Integration无法安装，添加该组建后重新安装成功，不知道是不是受它的影响
2. 安装Anaconda
    
    1. Anaconda包含了conda、Python等180多个科学包及其依赖项，功能十分强大
    2. [下载地址：https://www.anaconda.com/download/](https://www.anaconda.com/download/)
    3. 此处选择了Python `3.7`版本
        
        1. 后来发现目前Tensorflow不支持pythob `3.7`版本，在安装Tensorflow时会提示找不到包
        2. 此外，安装部分版本不兼容的CUDA、cuDNN也会导致安装失败
        3. [对应版本解决方案：https://github.com/fo40225/tensorflow-windows-wheel](https://github.com/fo40225/tensorflow-windows-wheel)，查看大神编译的各种版本tensorflow的地址，此次配置的为蓝色框线内的版本，Anaconda可以在后续修改环境为python `3.6` ![](https://img-blog.csdn.net/20181017224013177?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2NjI0ODk5/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
    4. 安装
        
        - 第一项可选可不选，不选的话需要自行配置环境变量 ![](https://img-blog.csdn.net/20181017224100177?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2NjI0ODk5/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
        - 第一项未选需要配置的环境变量 ![](https://img-blog.csdn.net/20181017224113288?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2NjI0ODk5/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
3. 安装CUDA（**注意版本**:exclamation:）
    
    1. 安装前注意
        
        1. GTX 960m运算能力为`5.0`，本次选择最新`v10.0`
        2. 网上许多资料都表示存在tensorflow、CUDA和cuDNN版本不兼容无法支持等问题，未一一测试，均选择当时最新版本。比较谨慎的，可以参考相关博文。
    2. [查看显卡支持：https://developer.nvidia.com/cuda-gpus](https://developer.nvidia.com/cuda-gpus)
    3. [选择对应版本下载：https://developer.nvidia.com/cuda-toolkit-archive](https://developer.nvidia.com/cuda-toolkit-archive)
    4. 安装
        
        1. 选择自定义安装
        2. 一般不需要安装GeForce Experience
    5. 安装可能存在的问题
        
        1. Visual Studio Intergration无法安装 > 可能的解决方法 > 1. 参考安装VS2017的过程，可能缺少组件 > 2. [参考教程：CUDA安装失败解决方法](https://blog.csdn.net/zzpong/article/details/80282814)
4. 下载cuDNN（**注意版本**:exclamation:），需要注册
    
    1. [下载链接：https://developer.nvidia.com/rdp/cudnn-download](https://developer.nvidia.com/rdp/cudnn-download)
    2. 此处选择和`CUDA v10.0`搭配的`cudnn-10.0-windows10-x64-v7.3.1.20`
    3. 解压到`CUDA`安装根目录，共三个文件夹：`bin`、`include`、`lib`
5. 安装Tensorflow运行环境
    
    1. 打开Anaconda prompt
    2. 配置清华仓库镜，输入指令: `conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/ conda config --set show_channel_urls yes`
    3. 创建运行环境，名称为tensorflow-gpu，python版本为`3.6` `conda create -n tensorflow-gpu python=3.6` 名称作为与其他环境隔离的标志，版本可自行更换
    4. 激活并进入该环境 `activate tensorflow-gpu` 其他指令可以参考Anaconda教程
    5. 升级pip `python -m pip install --upgrade pip`
    6. 安装相关依赖包
        
        - 如果确定所安装的版本兼容，可以直接安装 `pip install --ignore-installed --upgrade tensorflow-gpu`
        - 如果使用的是编译的tensorflow版本则需要进入下载目录进行安装，如进入`D:\Files`目录，有从github下载的编译版本`tensorflow_gpu-1.11.0-cp36-cp36m-win_amd64.whl`，执行安装命令即可 `pip install tensorflow_gpu-1.11.0-cp36-cp36m-win_amd64.whl`
    7. 测试Tensorflow
        
        1. 进入环境，运行python
        2. 键入 `import tensorflow as tf`
        3. 未报错则安装成功
        4. 可能存在的问题
            
            1. 报DLL找不到模块，可能是版本选择的问题
            2. 其他问题尚未可知

## 参考文章

1. [Win10下Tensorflow(GPU版)安装趟坑实录](https://blog.csdn.net/weixin_39290638/article/details/80045236)
2. [Win10 64 位Tensorflow-gpu安装（VS2017+CUDA9.2+cuDNN7.1.4+python3.6.5）](https://blog.csdn.net/wwtor/article/details/80603296?)
3. [Win10+VS2017+CUDA9.2 安装调试笔记](https://blog.csdn.net/wxtcstt/article/details/82771447?utm_source=blogxgwz0)
