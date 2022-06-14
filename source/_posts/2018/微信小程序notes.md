---
title: "微信小程序Notes"
date: "2018-04-08"
categories: 
  - "notes-summary"
tags: 
  - "wechat"
---

### Tips

- wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面，只能用 wx.switchTab 跳转到 tabbar 页面
    
- canvas尺寸设置需要自适应计算，使用API [getSystemInfo](https://developers.weixin.qq.com/miniprogram/dev/api/systeminfo.html#wxgetsysteminfoobject) 参考：【转】[微信小程序canvas尺寸设置 - 极乐君的文章 - 知乎](http://zhuanlan.zhihu.com/p/32837407)
    

### 踩坑记录

- 【转】[微信小程序开发踩坑指南](https://blog.csdn.net/tsyccnh/article/details/54380023)
    
- 小程序canvas和h5的canvas差别很大，注意区别
    
- 【转】[两百条微信小程序开发跳坑指南](https://blog.csdn.net/rolan1993/article/details/74547274)
    
- 触控事件触发顺序
    

| 动作 | 触发顺序 |
| --- | --- |
| 单击 tap | touchStart -> tap -> touchEnd |
| 长按 longPress | touchStart -> longPress -> tap -> touchEnd |

**区别单击、双击、长按事件**

```null
touchStart: function (e) {
    this.setData({
      touchStartTime: e.timeStamp,
      touchFlag: true
    });
  },
tapJudgement: function (e) {
    let that = this;
    that.setData({
      touchEndTime: e.timeStamp,
    });
    if (that.data.touchStartTime === null && that.data.touchEndTime === null) {
      return;
    }
    let gap = that.data.touchEndTime - that.data.touchStartTime;
    if (Math.abs(gap) < 350) {
      let currentTapTime = e.timeStamp;
      let lastTapTime = that.data.lastTapTime;
      that.setData({
        lastTapTime: currentTapTime
      });
      if (currentTapTime - lastTapTime < 300 && lastTapTime !== null) {
        //double tap event
        clearTimeout(that.data.lastTapTimeoutFunc);
        wx.showToast({
          title: 'double tap event',
        });
      } else {
        let timer = setTimeout(function () {
          wx.showToast({
          title: 'single tap event',
        });
        }, 300);
        that.setData({
          lastTapTimeoutFunc: timer
        });
      }
    }
  },
  longpressHandle: function (e) {
    wx.showToast({
      title: 'Trigger long press event',
    });
    this.setData({
      touchEndTime: e.timeStamp
    });
  }
```
