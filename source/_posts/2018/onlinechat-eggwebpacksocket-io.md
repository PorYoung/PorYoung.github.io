---
title: "OnlineChat - Egg+Webpack+Socket.IO"
date: "2018-11-29"
categories: 
  - "articles"
  - "project"
  - "项目"
tags: 
  - "egg"
  - "mongoose"
  - "node-js"
  - "notes"
---

See project [PorYoung/allChat](https://github.com/PorYoung/allChat), an online chat web application based on egg.js and sockt.io.

# Egg + Webpack + Socket.io Notes

## Directory Structure

```
- app
  - controller
  - extend
  - middleware
  - model
  - service
  - public
    - dist  /* webpack output directory */
  - io  /* socket.io */
    - controller
    - middleware
  - view
  - router.js
- config
  - config.default.js
  - plugin.js
- build /* webpack */    
  - src
  - webpack.config.js
- ...
```

## Egg

### Quick Usage

```
npm i egg-init -g
egg-init egg-example --type=simple
cd egg-example
npm i
npm run dev
```

The server listens on 7001.

See [egg](https://eggjs.org) for more detail.

### Config

#### `config/config.default.js` default content

```javascript
'use strict';
const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'your_keys';

  // add your config here

  return config;
}
```

#### middleware

```javascript
// add your middleware
config.middleware = ['permission','middleware2'];
// your middleware config, which will be the param 'options' you can access later
config.permission = {
  excludeUrl: {
    'ALL': ['/', '/login', '/register'],
    'POST': [],
    'GET': ['/register/checkUserid'],
  },
}
```

#### plugin

- ejs

```javascript
// egg-view-view plugin
config.view = {
  mapping: {
    '.html': 'ejs',
  },
  defaultViewEngine: 'ejs'
};
```

- mongoose

```javascript
// egg-mongoose plugin, [What is egg-mongoose](https://www.npmjs.com/package/egg-mongoose)
config.mongoose = {
  client: {
    url: 'mongodb://127.0.0.1/chat',
    options: {},
  },
};
```

- egg security and session

```javascript
// egg security solutions, see [egg Security](https://eggjs.org/en/core/security.html) for detail
// you have to send csrftoken before your request
config.security = {
  csrf: {
    headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
  },
};

config.session = {
  key: 'EGG_SESS',
  maxAge: 24 * 3600 * 1000, // 1 天
  httpOnly: true,
  encrypt: true,
  renew: true,
};
```

use `csrfAjax.js` to bind beforeSend event to ajax.

```javascript
import Cookies from 'js-cookie'
const csrftoken = Cookies.get('csrfToken');

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader('x-csrf-token', csrftoken);
    }
  },
});
```

- socket.io

```javascript
// see [egg Socket.IO](https://eggjs.org/en/tutorials/socketio.html) for detail
config.io = {
  namespace: {
    '/allChat': {
      connectionMiddleware: ['auth'],
      packetMiddleware: [],
    }
  }
};
```

- global config

```javascript
// define global configuration and variabels yourself
config.appConfig = {
  defaultAvatarArr: ['/public/image/default_avatar.jpg', '/public/image/default_avatar_1.jpg', '/public/image/default_avatar_2.jpg',],
  imagePublicPath: '/public/image',
  defaultChatRoom: 'default',
  defaultChatRoomMax: 999,
  messageSplitLimit: 8,
  allowReconnectionTime: 10 * 1000,
};
```

### Upload File and Form

#### use `Formidable` in egg

```js
// app/controller/xxx.js
const formidable = require('formidable');
const path = require('path');

// It's ok use formidable to wait the `form` end event to send response, but wrong in egg.
// You have to return a promise.

// handle function
async formParse(req, filename, config) {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.uploadDir = path.join(process.cwd(), 'app', config.appConfig.imagePublicPath);
    form.parse(req);
    form.on('fileBegin', (name, file) => {
      file.name = filename
      file.path = path.join(process.cwd(), 'app', config.appConfig.imagePublicPath, filename)
    })
    form.on('end', () => {
      resolve(path.join(config.appConfig.imagePublicPath, filename));
    })
    form.on('error', (err) => {
      reject('-1');
    })
  });
}

// usage
// const result = await this.formParse(ctx.req, filename, config);
```

### mongoose

#### use `mongoose` in egg

```js
// take login for example

// app/model/user.js
module.exports = app => {
const mongoose = app.mongoose;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    // mongoose aliases
    alias: 'userid',
  },
  username: String,
  password: String,
};
};

// app/service/user.js
const Service = require('egg').Service;
class UserService extends Service {
  async findOneByUserid(userid) {
    let docs = await this.ctx.model.User.findOne({
      _id: userid,
    });
    if (docs) {
      // mongoose virtuals
      return docs.toObject({
        virtuals: true
      });
    }
    return docs;
  }
}

// app/controller/user.js
const Controller = require('egg').Controller;
class UserController extends Controller {
  async login() {
    const {
      ctx,
      service
    } = this;
    let {
      userid,
      password,
      rememberMe
    } = ctx.request.body;
    let userinfo = await service.user.findOneByUserid(userid);
    if (userinfo && userinfo.password == password) {
      ctx.session.user = Object.assign(userinfo, {
        ipAddress: ctx.request.ip
      });
      if (rememberMe) ctx.session.maxAge = ms('30d');
      return ctx.body = '1';
    }
    return ctx.body = '-1';
  }
}
module.exports = UserController;
```

#### `$or`, `$and`

```js
model.find({
  $or:[{
    criterion_1: 1
  },{
    $and: [{
      criterion_2: 2
    },{
      criterion_3: 3
    }]
  }]
});
```

#### `alias` and `virtuals`

[Aliaes](https://mongoosejs.com/docs/guide.html#aliases) and [Virtuals](https://mongoosejs.com/docs/guide.html#virtuals) for more detail.

```js
const UserSchema = new Schema({
    _id: {
      type: String,
      unique: true,
      alias: 'userid',
    },
});
// you can use _id or userid in getter and setter
// assume `doc` is the query doc
console.log(doc.toObject({ virtuals: true })); // { _id: 'xxx', userid: 'xxx' }
console.log(doc.userid); // "xxx"
```

#### Populate

[Populate](https://mongoosejs.com/docs/populate.html) for more detail. You must set `ref` to `_id`, other fields are not avalible;

> Note: ObjectId, Number, String, and Buffer are valid for use as refs. However, you should use ObjectId unless you are an advanced user and have a good reason for doing so.

```js
// take `User` model and `Message` model for example,
// which user have more than one messages,
// `Message` have attributes that ref to `_id` alias `userid` here.

// app/model/message.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const MessageSchema = new Schema({
    from: {
      type: String,
      ref: 'User',
    },
    to: {
      type: String,
      ref: 'User',
    },
  });
  return mongoose.model('Message', MessageSchema);

  // now you can access user infomation while query message
  // Message.find(citerion).populate('from','userid username').populate('to','userid username');
}
```

#### Find by pagination

```js
// in app/service/message.js
async findByPagination(criterion, limit, page) {
  const total = await this.ctx.model.Message.count(criterion);
  const totalPageNum = parseInt(total / limit);
  if (page > totalPageNum) {
    return null;
  }
  const start = limit * page;
  const queryArr = await this.ctx.model.Message
    .where(criterion)
    // sort by date desc
    .sort({
      date: -1
    })
    .limit(limit)
    .skip(start)
    .populate('from','userid username avatar')
    .populate('to','userid username avatar');
  let resArr = [];
  queryArr.forEach((doc)=>{
    resArr.push(doc.toObject({virtuals: true}));
  });
  return resArr;
}
```

### Helper

#### get remote IP

```js
// ctx.request.ip

// use socket.io to get ip address
// socket.handshake.address
// maybe you need to parse the IP address
parseIPAddress(ip) {
  if (ip.indexOf('::ffff:') !== -1) {
    ip = ip.substring(7);
  }
  return ip;
}
```

### Socket.IO

#### use socket.io in egg

1. controller extends `app.controller`
2. middleware

```js
// app/io/middleware/auth.js
module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper, service } = ctx;
    const sid = socket.id;
    const nsp = app.io.of('/allChat');
    const query = socket.handshake.query;
  }
}
```

#### get socketid

```js
// by the socket object, get the connector id
const sid = socket.id;

// get online user socketid in room by the namespace adapter, except current connector id
nsp.adapter.clients(rooms, (err, clients) => {
  //clients is an socketid arrs
  logger.info('#online', clients);
}
```

#### disconnect or refresh event

When user refresh current page in browser, it will trigger disconnection and leave event, then the join event. Try to use a `timer`(**setTimeout function**) to solve this problem, but it might not be a good solution.

See [auth.js](https://github.com/PorYoung/allChat/blob/master/app/io/middleware/auth.js).

#### send message to users in room

```js
socket.to(room).emit('room_message', message);
```

#### send private message to user

```js
// sender
let userinfo = await service.user.findOneByUserid(ctx.session.user.userid);
message.from = {
  userid: userinfo.userid,
  username: userinfo.username,
};
// receiver
let toUserinfo = await service.user.findOneByUserid(message.to);
if (!toUserinfo) {
  socket.emit(socket.id, helper.parseMsg('warning', {
    type: 'warning',
    content: '该用户不见了=_=!',
  }));
} else {
  message.to = {
    userid: toUserinfo.userid,
    username: toUserinfo.username,
    socketid: toUserinfo.socketid,
  };
  let messageParsed = helper.parseMsg('private_message', message);
  socket.to(message.to.socketid).emit(message.to.socketid, messageParsed);
}
```

#### use socket.io in front end

instead of `<script src="/socket.io/socket.io.js"></scrupt>`

```js
const socketClient = require('socket.io-client');
const allChat = socketClient(config.host.concat('/allChat'), {
  query: {
    room: config.socket.room,
  },
  transports: ['websocket'],
});

allChat.on("connect", () => {
  const sid = allChat.id;
  console.log('#connected', sid, allChat);
  // 监听自身 id 以实现 p2p 通讯
  allChat.on(sid, msg => {
    console.log('#receive,', msg);
    switch (msg.data.action) {
      case 'deny':
      case 'welcome':
      case 'warning':
      case 'private_message':
    }
  });
});

// 系统事件
allChat.on('disconnect', msg => {
  console.log('#disconnect', msg);
});

allChat.on('disconnecting', () => {
  console.log('#disconnecting');
});

allChat.on('error', () => {
  console.log('#error');
});
```

#### Tips

1. the `socktid` get from `Namespace.adapter.clients` contain the room `#room` at the head.
    
2. get room the current connector joined, `Object.keys(socket.rooms)[0];`
    

## Webpack 4.0

you can use `egg-webpack` in egg or use `webpack-cli`.

see [webpack.config.js](https://github.com/PorYoung/allChat/blob/master/build/webpack.config.js).

### spiltChunks

```js
optimization: {
  splitChunks: {
    cacheGroups: {
      common: {
        name: "common",
        chunks: "all",
        minSize: 1,
        priority: 0,
        minChunks: 2,
      },
      vendors: {
        name: "vendors",
        test: /[\\/]node_modules[\\/]/,
        chunks: "all",
        priority: 10
      }
    }
  },
},
```

### extract-text-webpack-plugin

to support webpack 4.0, install `extract-text-webpack-plugin@next`

```js
//module rules
{
  test: /\.css/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader']
  }),
},
{
  test: /\.(less)/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [{
        loader: 'css-loader',
        options: {
          alias: {
            '@': path.resolve(staticPath, 'image') // '~@/logo.png' 这种写法，会去找src/img/logo.png这个文件
          }
        },
      },
      'postcss-loader',
      {
        loader: 'less-loader',
        options: {
          lessPlugins: [
            new LessPluginCleanCSS({
              advanced: true,
            }),
          ],
        },
      }
    ]
  }),
},

new ExtractTextPlugin({
  filename: 'css/[name].bundle-[hash].css',
}),
```

### import jquery

```js
new webpack.ProvidePlugin({
    "$": "jquery",
    "jQuery": "jquery",
    "window.jQuery": "jquery",
    // underscore
    "_": 'underscore'
  }),
```

## Utils

### TouchEvent

```js
var myTouchEvent = function () {
  var swip_time = 300,
    swip_dis = 30,
    point_start,
    point_end,
    time_start,
    time_end,
    //1 上 2 右 3 下 4左
    result;
  if ("ontouchstart" in window) {
    var startEvt = "touchstart",
      moveEvt = "touchmove",
      endEvt = "touchend";
  } else {
    var startEvt = "mousedown",
      moveEvt = "mousemove",
      endEvt = "mouseup";
  }
  var getPos = function (e) {
    var touches = e.touches;
    if (touches && touches[0]) {
      return {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
    }
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
  var getDistance = function (p1, p2) {
    return parseInt(Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2)));
  }
  var getDirection = function (p1, p2) {
    var angle = Math.atan2(p1.y - p2.y, p2.x - p1.x) * 180 / Math.PI;
    if (angle <= 45 && angle >= -45) return "right";
    if (angle >= 45 && angle <= 135) return "up";
    if (angle >= 135 || angle <= -135) return "left";
    if (angle <= -45 && angle >= -135) return "down";
  }
  var startEvtHandle = function (e) {
    var pos = getPos(e);
    var touches = e.touches;
    if (!touches || touches.length == 1) {
      point_start = getPos(e);
      time_start = new Date().getTime();
    }
    //显示刷新图标
    $("#notification").css({
      height: 0,
      overflow: "hidden"
    }).html("<i class='fa fa-spinner fa-pulse fa-2x fa-fw'></i><span class='sr-only'>释放加载更多</span>").show();
    point_end = pos;
  }
  var transformYPre = 0;
  var moveEvtHandle = function (e) {
    point_end = getPos(e);
    var y = point_end.y - point_start.y;
    if (y > 0 && y > 80) {
      y = 80;
    } else if (y < 0) {
      y = 0;
    }
    transformYPre += y - transformYPre;
    $("#listPanel").css({
      transition: "all 1s",
      transform: "translate3d(0," + transformYPre + "px,0)"
    })
    $("#notification").css({
      transition: "all 1s",
      height: transformYPre + "px",
      lineHeight: transformYPre + "px"
    })
    e.preventDefault();
  }
  var endEvtHandle = function (e) {
    time_end = new Date().getTime();
    var dis = getDistance(point_start, point_end);
    var time = time_end - time_start;
    //构成滑动事件
    if (dis >= swip_dis && time >= swip_time) {
      var dir = getDirection(point_start, point_end),
        disY = point_end.y - point_start.y,
        disX = point_end.x - point_start.x;
      if (disY >= 80 && dir == "down") {
        result = 3;
        //下拉行为有效
        loadMessage(++page);
        console.log('加载中');
        //加载完成后释放 等待30s
        var timer = setInterval(function () {
          if (loadMessageFlag) {
            $("#listPanel").css({
              transition: "all 1s",
              transform: "translate3d(0,0,0)"
            })
            //显示加载成功
            if (loadMessageFlag == 1) $("#notification").html("<i class='fa fa-check-circle-o fa-2x fa-fw' style='color: #00EE00'></i><span class='sr-only'>Success</span>");
            else if (loadMessageFlag == 2) $("#notification").html("没有更多消息了=_=");
            loadMessageFlag = 0;
            setTimeout(function () {
              $("#notification").css({
                height: "30px",
                lineHeight: "30px"
              }).html("").hide();
              clearInterval(timer);
            }, 300);
          }
        });
        //30s后停止
        setTimeout(function () {
          clearInterval(timer);
          //显示加载失败
          $("#notification").html("<i class='fa fa-remove fa-4x fa-fw' style='color: #00EE00'></i><span class='sr-only'>Failed</span>");
          loadMessageFlag = false;
          setTimeout(function () {
            $("#notification").css({
              height: "30px",
              lineHeight: "30px"
            }).html("").hide();
          }, 300);
        }, 31000);
      } else if (disX >= 80 && dir == "right") {
        result = 2;
      } else if (disX < -30 && dir == "left") {
        result = 4;
      } else if (disY < -30 && dir == "up") {
        $("#listPanel").scrollTop(parseInt(Math.abs(point_end.y - point_start.y)));
        result = 1;
      }
    } else {
      $("#listPanel").css({
        transition: "all 1s",
        transform: "translate3d(0,0,0)"
      }).animate({
        scrollTop: '30px'
      }, 300);
      $("#notification").css({
        height: "30px",
        lineHeight: "30px"
      }).html("").hide();
    }
  }

  $("#listPanel").on(startEvt, function (e) {
    if ($(this).scrollTop() <= 0) {
      startEvtHandle(e);
      $(this).on(moveEvt, moveEvtHandle);
      $(this).on(endEvt, function (e) {
        endEvtHandle(e);
        $(this).off(moveEvt).off(endEvt);
      });
    }
  })
}
```

### Scroll To Bottom

```js
const scrollToBottom = () => {
  let scrollHeight = $("#listPanel")[0].scrollHeight - $("#listPanel")[0].clientHeight;
  $("#listPanel").animate({
    scrollTop: scrollHeight
  }, 300);
};
```
