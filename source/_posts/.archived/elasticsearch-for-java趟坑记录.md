---
title: "Elasticsearch for Java趟坑记录"
date: "2019-07-14"
categories: 
  - "articles"
tags: 
  - "elasticsearch"
  - "jest"
---

[项目地址](https://github.com/PorYoung/Elasticsearch-for-Ocr)

## 安装

1. elasticsearch
    
    我安装的是`6.2.2`版本，刚入坑不太敢用新版本的，怕找资料麻烦，这也直接影响后续安装的插件得是`6.2.2`同是`6.x`版本的都不行
    
2. kibana `6.2.2`
    
    方便管理elasticsearch的工具，启动后访问`localhost:5601`可以直接在控制台进行测试
    
    ```
    # 查看健康状态，Green为正常
    GET /_cat/health?v
    GET /_cat/indices?v
    GET /_cluster/health?pretty=true
    # 如果状态是Yellow，可以进行以下设置
    PUT /_settings
    {
        "index" : {
            "number_of_replicas" : 0
        }
    }
    ```
    
3. elasticsearch-analysis-ik 中文分词插件
    
    版本要和elasticsearch一致，即[6.2.2](https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v5.5.1/elasticsearch-analysis-ik-6.2.2.zip)
    
    在`elasticsearch`安装目录`plguins`下新建`ik`文件夹，解压elasticsearch-analysis-ik到`ik`文件夹
    
4. 自定义词库
    
    我是用[清华开放词库](http://thuocl.thunlp.org/)的开放词库，选择需要的词典拼在一起，做成`userdict.txt`
    
    进入`config`目录，将自定义词典放在该目录下
    
    修改`IKAnalyzer.cfg.xml`自定义词典的路径
    
    `$xslt <entry key="ext_dict">userdict.txt</entry>`
    
    重启elasticsearch
    

## 记录

以下`Ocr`和`TextResult`为自定义的类

### lombok使用

[Lombok简介](https://www.jianshu.com/p/20fbe45f7c08)

### Jest索引操作 | ik中文分词设置

注意`ik_smart`和`ik_max_words`区别

elasticsearch节点基本的设置已经废弃，手动设置索引级别如下

```js
PUT ocr
{
    "settings": {
        "index": {
           "number_of_shards": 1,
           "number_of_replicas": 1
        },
        "analysis": {
            "analyzer": {
                "ik": {
                    "tokenizer": "ik_smart"
                }
            }
        }
    },
    "mappings": {
        "doc": {
            "dynamic": true,
            "properties": {
              "textResult":{
                "type": "nested",
                "properties": {
                  "text":{
                    "type": "text",
                    "analyzer": "ik_smart",
                    "search_analyzer": "ik_smart"
                  }
                }
              },
                "ocrText": {
                  "type": "text",
                  "analyzer": "ik_smart",
                  "search_analyzer": "ik_smart"
                }
            }
        }
    }
}
```

#### 创建索引

Jest java创建索引的操作方法如下：

```java
public JestResult createIndexMapping(String index, String settinsJson, String mappingsJson) {
    JestResult jestResult = null;
    try {
        CreateIndex createIndex = new CreateIndex.Builder(index)
                .settings(settinsJson)
                .mappings(mappingsJson)
                .build();
        jestResult = jestClient.execute(createIndex);
        log.info("createIndexMapping result:{}" + jestResult.isSucceeded());
        if (!jestResult.isSucceeded()) {
            log.error("settingIndexMapping error:{}" + jestResult.getErrorMessage());
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
    return jestResult;
}
```

`settingsJson`和`mappingsJson`都是以上拼接好的字符串，主要分布要取`"settings":{}`和`"mappings":{}`内的部分

#### 判断索引是否存在

判断索引是否存在，判断`result.isSucceeded()`

```java
public JestResult indicesExists(String index) {
    IndicesExists indicesExists = new IndicesExists.Builder(index).build();
    JestResult result = null;
    try {
        result = jestClient.execute(indicesExists);
        log.info("indicesExists == " + result.getJsonString());
    } catch (IOException e) {
        e.printStackTrace();
    }
    return result;
}
```

#### 获取索引配置

```java
public boolean getIndexSettings(String index) {
    try {
        JestResult jestResult = jestClient.execute(new GetSettings.Builder().addIndex(index).build());
        log.info(jestResult.getJsonString());
        return jestResult.isSucceeded();
    } catch (IOException e) {
        e.printStackTrace();
    }
    return false;
}
```

#### 保存

```java
public boolean save(Ocr ocr) {
    Index index = new Index.Builder(ocr).index(INDEX).type(TYPE).build();
    try {
        JestResult jestResult = jestClient.execute(index);
        log.info("save返回结果{}", jestResult.getJsonString());
        return jestResult.isSucceeded();
    } catch (IOException e) {
        log.error("save异常", e);
        return false;
    }
}
```

#### 删除索引

```java
public JestResult deleteIndex(String index) {
    DeleteIndex deleteIndex = new DeleteIndex.Builder(index).build();
    JestResult result = null;
    try {
        result = jestClient.execute(deleteIndex);
        log.info("deleteIndex == " + result.getJsonString());
    } catch (IOException e) {
        e.printStackTrace();
    }
    return result;
}
```

### Java文件读取Json文件

使用`Apache Commons IO`和`Alibaba FastJson`

```markup
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.4</version>
</dependency>

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.40</version>
</dependency>
```

```java
public static List<File> getFileList(String strPath, List<File> filelist) {
    File dir = new File(strPath);
    File[] files = dir.listFiles(); // 该文件目录下文件全部放入数组
    if (files != null) {
        for (int i = 0; i < files.length; i++) {
            String fileName = files[i].getName();
            if (files[i].isDirectory()) { // 判断是文件还是文件夹
                getFileList(files[i].getAbsolutePath(), filelist); // 获取文件绝对路径
            } else if (fileName.endsWith("json")) { // 判断文件名是否以.avi结尾
                String strFileName = files[i].getAbsolutePath();
                System.out.println("---" + strFileName);
                filelist.add(files[i]);
            } else {
                continue;
            }
        }

    }
    return filelist;
}

// 读取Json文件
String path = 文件路径;
List<File> filelist = new ArrayList<File>();
Utils.getFileList(path, filelist);
for (File file : filelist) {
    String input = FileUtils.readFileToString(file, "UTF-8");
    JSONObject jsonObject = JSONObject.parseObject(input);
    ...
}
```

### Jest搜索操作

手动测试搜索，指令如下：

```js
# 模糊搜索
GET ocr/doc/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "ocrText": "${queryString}"
          }
        },
        {
          "nested": {
            "path": "textResult",
            "query": {
              "match": {
                "textResult.text": "${queryString}"
              }
            }
          }
        }
      ]
    }
  },
  "_source": ["ocrText","pdfUrl","id"],
  "highlight": {
    "fields": {
      "textResult.text": {},
      "ocrText": {}
    }
  }
}

# 详细信息
GET ocr/doc/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "id": "${id}"
          }
        },
        {
          "nested": {
            "path": "textResult",
            "query": {
              "match": {
                "textResult.text": "${wd}"
              }
            },
            "inner_hits":{
              "_source":["textResult"]
            }
          }
        }
      ]
    }
  },
  "highlight": {
    "fields": {
      "textResult.text": {}
    }
  }
}
```

#### Get By Id

```java
public Ocr get(String id) {
    Get get = new Get.Builder(INDEX, id).type(TYPE).build();
    try {
        JestResult result = jestClient.execute(get);
        if (result.isSucceeded())
            return result.getSourceAsObject(Ocr.class);
    } catch (IOException e) {
        log.error("get异常", e);
    }
    return null;
}
```

#### 使用json搜索，包含nested搜索和获取inner\_hits

```java
public SearchResult jsonSearch(String json, String indexName, String typeName) {
    Search search = new Search.Builder(json).addIndex(indexName).addType(typeName).build();
    try {
        return jestClient.execute(search);
    } catch (Exception e) {
        log.warn("index:{}, type:{}, search again!! error = {}", indexName, typeName, e.getMessage());
        sleep(100);
        return jsonSearch(json, indexName, typeName);
    }
}
```

用以上手动测试的`json`搜索

```java
public Page<Ocr> query(String queryString, int pageNo, int size) {
    String queryJson = "{\n" +
            "  \"query\": {\n" +
            "    \"bool\": {\n" +
            "      \"should\": [\n" +
            "        {\n" +
            "          \"match\": {\n" +
            "            \"ocrText\": \"${queryString}\"\n" +
            "          }\n" +
            "        },\n" +
            "        {\n" +
            "          \"nested\": {\n" +
            "            \"path\": \"textResult\",\n" +
            "            \"query\": {\n" +
            "              \"match\": {\n" +
            "                \"textResult.text\": \"${queryString}\"\n" +
            "              }\n" +
            "            }\n" +
            "          }\n" +
            "        }\n" +
            "      ]\n" +
            "    }\n" +
            "  },\n" +
            "  \"_source\": [\"ocrText\",\"pdfUrl\",\"id\"], \n" +
            "  \"highlight\": {\n" +
            "    \"fields\": {\n" +
            "      \"textResult.text\": {},\n" +
            "      \"ocrText\": {}\n" +
            "    }\n" +
            "  }\n" +
            "}";
    queryJson = queryJson.replace("${queryString}", queryString);
    log.info("QueryString: {}" + queryJson);
    Search search = new Search.Builder(queryJson).addIndex(INDEX).addType(TYPE).build();
    SearchResult searchResult = null;
    try {
        searchResult = jestClient.execute(search);

        if (searchResult.isSucceeded()) {
            List<SearchResult.Hit<Ocr, Void>> hits = searchResult.getHits(Ocr.class);
            List<Ocr> ocrs = hits.stream().map(hit -> {
                Ocr ocr = hit.source;
                Map<String, List<String>> highlight = hit.highlight;
                if (highlight.containsKey("ocrText")) {
                    Object arr[] = highlight.get("ocrText").toArray();
                    List<String> ocrTexts = new ArrayList<>();
                    for (Object o : arr) {
                        ocrTexts.add((String) o);
                    }
                    ocr.setHlOcrText(ocrTexts);
                }
                if (highlight.containsKey("textResult.text")) {
                    Object arr[] = highlight.get("textResult.text").toArray();
                    List<String> textResults = new ArrayList<>();
                    for (Object o : arr) {
                        textResults.add((String) o);
                    }
                    ocr.setHlTextResult(textResults);
                }
                return ocr;
            }).collect(toList());
            int took = searchResult.getJsonObject().get("took").getAsInt();
            Page<Ocr> page = Page.<Ocr>builder().list(ocrs).pageNo(pageNo).size(size).total(searchResult.getTotal()).took(took).build();
            return page;
        } else {
            log.warn("查询失败：index:{}, type:{}, error = {}", INDEX, TYPE, searchResult.getResponseCode());
        }
    } catch (Exception e) {
        log.error("执行查询失败，抛出异常：index:{}, type:{}", INDEX, TYPE);
        return null;
    }

    return null;
}

@Override
public Ocr queryDetail(String id, String queryString) {
    String queryJson = "{\n" +
            "  \"query\": {\n" +
            "    \"bool\": {\n" +
            "      \"must\": [\n" +
            "        {\n" +
            "          \"match\": {\n" +
            "            \"id\": \"${id}\"\n" +
            "          }\n" +
            "        },\n" +
            "        {\n" +
            "          \"nested\": {\n" +
            "            \"path\": \"textResult\",\n" +
            "            \"query\": {\n" +
            "              \"match\": {\n" +
            "                \"textResult.text\": \"${queryString}\"\n" +
            "              }\n" +
            "            },\n" +
            "            \"inner_hits\":{\n" +
            "              \"_source\":[\"textResult\"]\n" +
            "            }\n" +
            "          }\n" +
            "        }\n" +
            "      ]\n" +
            "    }\n" +
            "  },\n" +
            "  \"highlight\": {\n" +
            "    \"fields\": {\n" +
            "      \"textResult.text\": {}\n" +
            "    }\n" +
            "  }\n" +
            "}";
    queryJson = queryJson.replace("${queryString}", queryString);
    queryJson = queryJson.replace("${id}", id);
    log.info("QueryString: {}" + queryJson);
    Search search = new Search.Builder(queryJson).addIndex(INDEX).addType(TYPE).build();
    SearchResult searchResult = null;
    try {
        searchResult = jestClient.execute(search);
        if (searchResult.isSucceeded()) {
            List<SearchResult.Hit<Ocr, Void>> hits = searchResult.getHits(Ocr.class);
            List<Ocr> ocrs = hits.stream().map(hit -> {
                Ocr ocr = hit.source;
                Map<String, List<String>> highlight = hit.highlight;
                if (highlight.containsKey("textResult.text")) {
                    Object arr[] = highlight.get("textResult.text").toArray();
                    List<String> textResults = new ArrayList<>();
                    for (Object o : arr) {
                        textResults.add((String) o);
                    }
                    ocr.setHlTextResult(textResults);
                }
                return ocr;
            }).collect(toList());
            // 获取inner_hits
            JsonObject innerHits = searchResult.getJsonObject().get("hits").getAsJsonObject().get("hits").getAsJsonArray().get(0).getAsJsonObject().get("inner_hits").getAsJsonObject();
            JsonArray innerHitsResultArray = innerHits.get("textResult").getAsJsonObject().get("hits").getAsJsonObject().get("hits").getAsJsonArray();
            List<TextResult> textResults = new ArrayList<>();
            for (JsonElement result : innerHitsResultArray) {
                JsonObject source = result.getAsJsonObject().get("_source").getAsJsonObject();
                TextResult textResult = new TextResult();
                textResult.setCharNum(source.get("charNum").getAsInt());
                textResult.setHandwritten(source.get("isHandwritten").getAsBoolean());
                textResult.setLeftBottom(source.get("leftBottom").getAsString());
                textResult.setLeftTop(source.get("leftTop").getAsString());
                textResult.setRightBottom(source.get("rightBottom").getAsString());
                textResult.setRightTop(source.get("rightTop").getAsString());
                textResult.setText(source.get("text").getAsString());
                textResults.add(textResult);
            }
            Ocr ocr = ocrs.get(0);
            ocr.setTextResult(textResults);
            return ocr;
        } else {
            log.error("执行查询失败，抛出异常：index:{}, type:{}", INDEX, TYPE);
            return null;
        }
    } catch (Exception e) {
        log.error("执行查询失败，抛出异常：index:{}, type:{}", INDEX, TYPE);
        return null;
    }
}
```

#### 分页

```java
private int from(int pageNo, int size) {
    return (pageNo - 1) * size < 0 ? 0 : (pageNo - 1) * size;
}
```

## 效果

![预览](https://i.loli.net/2019/07/14/5d2a95418c84a43268.gif)
