---
title: "Class4 Website"
date: "2018-02-12"
categories: 
  - "项目"
tags: 
  - "php"
  - "web"
---

[click to visit website](https://class4.poryoung.cn)

- **website constructure** **\-index.php** **\-announce.php** **\-favicon.ico** **\-api** ---download.php ---handle.php ---sendMessage.php **\-admin** ---adminLogin.php ---adminLogin\_handle.php ---adminSystem.php ---announceAdd.php ---annouceManager.php ---annouceModify.php ---annouceModifyHandle.php ---destroyLogin.php ---downFile.php ---fileManage.php ---handle\_function.php ---loginCheck.php ---messageManage.php ---signUp.php ---signUp\_handle.php ---userManage.php ---config.php ---connect.php **\-css** **\-js** **\-img** **\-music** **\-fla** **\-database\_back** **\-version**
    
- **connect with mysql database**
    

```php
/**
 * config.php
 * define mysql connect infomation
 */
define('HOST','localhost');
define('USERNAME','root');
define('PASSWORD','123456');
```

```null
/**
 * connect.php
 * connect to mysql database
 */
//require config file
require_once('config.php');
//connect with daatabase
if(!$conn = mysqli_connect(HOST,USERNAME,PASSWORD)){
    echo mysqli_error($conn);
}
//select databse
if(!mysqli_select_db($conn,'database name')){
    echo mysqli_error($conn);
}
//set character sets
if(!mysqli_query($conn,'SET NAMES UTF8')){
    echo mysqli_error($conn);
}
```

- **file handle**

```null
//define function readDirectory(path)
function readDirectory($path){
    //open dir and save as variable $handle
    $handle = opendir($path);
    $arr = null;
    while(($item = readdir($handle)) !== false){
        //read successful and exclude the condition, dot and double dots(. & ..)
        if ($item!="."&&$item!="..") {
            //test if is file
            if (is_file($path."/".$item)) {
                $arr['file'][] = $item;
            }
            if (is_dir($path."/".$item)) {
                $arr['dir'][] = $item;
            }
        }
    }
    closedir($handle);
    return $arr;
}
//get file size : filesize($path)
//get extension name : explode('.',$filename)
//delete file : unlink($path)
//define function uploadFile($file)
function uploadFile($file){
    $fileName = $file['NAME']['name'];
    $fileType = $file['NAME']['type'];
    $fileTempName = $file['NAME']['tmp_name'];
    $fileError = $file['NAME']['error'];
    $fileSize = $file['NAME']['size'];
    if($fileError == UPLOAD_ERR_OK || $fileError == 0){
        $fileName = 'other path or new file name';
        //use function copy() or move_uploaded_file()
        if(@copy($fileTempName, $fileName)){
            //upload successful
        }else{
            //upload fail
        }
    }else{
        //upload fail
        switch($fileError){
            //1 the size of upload file is bigger than the setting "upload_max_filesize" in php.ini
            //2 the size of upload file is bigger than the setting of html form "MAX_FILE_SIZE"
            //3 partly uploaded
            //4 haven't chosen files
            //6 cannot find temp dir
            //others : system error
        }
    }
}
//download file from front end
header('Content-Disposition: attachment; filename='.$name);
header('Content-Length:'.filesize($filename));
readfile($filename);
```

- **session** `$_SESSION[name]` `isset($_SESSION[name])` `session_start()` `session_destroy()`
