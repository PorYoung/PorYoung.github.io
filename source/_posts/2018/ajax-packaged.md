---
title: "Ajax Packaged"
date: "2018-02-14"
categories: 
  - "notes-summary"
tags: 
  - "ajax"
  - "javascript"
  - "summary"
---

**try to pakage ajax by myself**

**optional paramas:**

- method: get(default) post
- url
- data: Allow Type: Object, FormData
- dataType: Object(default) , auto translate to urldecode json file
- async: true(default) false
- showProgress: if dataType is "file" and this is a function, it will be called instantly
- success: callback function while request successfully param: server responseText
- fail: callback funciton while request failed

**main function**

```null
function ajax(options){
    var opt = {
        method: "GET",
        async: true,
    }
    //if browser dosen't support Object.assign() you can define by yourself
    Object.assign(opt,options)
    if(!opt.url) return
    var XMLHttp = null
    if(XMLHttpRequest){
        XMLHttp = new XMLHttpRequest()
    }else{
        XMLHttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    //method: post
    if(!!opt.method && opt.method.toUpperCase() == "POST"){
        XMLHttp.open("POST",opt.url,opt.async)
        //dataType: json
        if(!!opt.dataType && opt.dataType.toUpperCase() == "JSON"){
            opt.postData = JSON.stringify(opt.data)
            XMLHttp.setRequestHeader("Content-Type","application/json")
            XMLHttp.send(opt.postData)
        }
        //dataType: file
        else if(!!opt.dataType && opt.dataType.toUpperCase() == "FILE"){
            XMLHttp.send(opt.data)
        }
        //dataType: Object
        else{
            var param = []
            for(var key in opt.data){
                if(opt.data.hasOwnProperty(key)){
                    param.push(key+"="+opt.data[key])
                }
            }
            opt.postData = param.join('&')
            var urlparams = opt.url.slice(opt.url.indexOf('?')+1)
            if(urlparams.indexOf('?') == -1){
                opt.postData.concat('&'+urlparams)
            }
            XMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            XMLHttp.send(opt.postData)
        }
    }
    //method: get
    else if(opt.method.toUpperCase() === "GET"){
        var params = []
        if(!!opt.data){
            for(var key in opt.data){
                if(opt.data.hasOwnProperty(key)){
                    params.push(key + '=' + opt.data[key])
                }
            }
            opt.postData = params.join('&')
        }
        if(!!opt.postData){
            opt.url.concat('&'+opt.postData)
        }
        XMLHttp.open('GET',opt.url,opt.async)
        XMLHttp.send()
    }
    //handle response
    if(!!opt.dataType && opt.dataType.toUpperCase() == "FILE" && typeof opt.showProgress == "function"){
        if("onprogress" in (new XMLHttpRequest)){
            XMLHttp.onprogress = function(e){
                if(e.lengthComputable){
                    var percent = Math.round(100*e.loaded/e.total)+"%"
                    opt.showProgress(percent)
                }
            }
            XMLHttp.onload = function(){
                var MSG = JSON.parse(request.responseText);
                opt.success(MSG)
            }
        }else{
            XMLHttp.onreadystatechange = function(){
                if(XMLHttp.readyState == 4){
                    if(XMLHttp.status == 200){
                        var res = XMLHttp.responseText
                        try{
                            res = JSON.parse(res)
                        }catch(e){
                            console.warn(e)
                        }
                        return !!opt.success?opt.success(res):null
                    }else{
                        return !!opt.fail?opt.fail(XMLHttp.status,XMLHttp.statusText):null
                    }
                }
            }
        }
    }else{
        XMLHttp.onreadystatechange = function(){
            if(XMLHttp.readyState == 4){
                if(XMLHttp.status == 200){
                    var res = XMLHttp.responseText
                    try{
                        res = JSON.parse(res)
                    }catch(e){
                        console.warn(e)
                    }
                    return !!opt.success?opt.success(res):null
                }else{
                    return !!opt.fail?opt.fail(XMLHttp.status,XMLHttp.statusText):null
                }
            }
        }
    }
}
```
