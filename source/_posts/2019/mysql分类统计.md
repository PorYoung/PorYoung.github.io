---
title: "MySql分类统计"
date: "2019-05-05"
categories: 
  - "notes-summary"
  - "temp"
---

表1记录物品信息，表2记录物品收藏信息，通过联表查询获取物品信息和物品收藏数。

表1：house\_info ![Image NotFound](https://blog.poryoung.cn/wp-content/uploads/2019/05/050519_0141_MySql1.png)

表2：house\_collect ![Image NotFound](https://blog.poryoung.cn/wp-content/uploads/2019/05/050519_0141_MySql2.png)

```sql
SELECT
    h.house_id,
    h.user_id,
    h.region,
    h.address,
    h.price,
    h.pet,
    h.facility,
    h.house_image,
    h.house_rent_staus,
    IFNULL( t_collect_count, 0 ) AS collect_count 
FROM
    house_info AS h
    LEFT JOIN ( SELECT c.house_id, COUNT( * ) t_collect_count FROM house_collect AS c GROUP BY c.house_id ) t ON h.house_id = t.house_id;
```
