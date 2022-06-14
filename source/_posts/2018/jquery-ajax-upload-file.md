---
title: "Jquery Ajax Upload File (html5 FormData)"
date: "2018-05-22"
categories: 
  - "notes-summary"
tags: 
  - "ajax"
  - "jquery"
---

### How to use Jquery Ajax to upload files with uploading progress

* * *

#### get single file

```
let data = $('input[tpye=file]')[0].files[0]
let file = new FormData()
file.append('file',data)
```

#### pakage uploading progress xhr function

```
function onprogress(){
    var loaded = evt.loaded;
    var tot = evt.total;
    var per = Math.floor(100*loaded/tot)
    console.log(per)
}

function xhr(){
    let xhr = $.ajaxSettings.xhr()
    if(onprogress && xhr.upload){
        xhr.upload.addEventListener("progress" , onprogress, false);
        return xhr;
    }
}
```

#### use $.ajax() to upload

```
$.ajax({
    url:'url address',
    type:'POST',
    contentType:false,
    processData:false,
    data:file,
    xhr:xhr,
    success:function(res){
        //handle funciton
    }
})
```

#### [more about jquery ajax](https://www.cnblogs.com/zhuxiaojie/p/4783939.html)
