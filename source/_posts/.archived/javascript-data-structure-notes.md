---
title: "JavaScript Data Structure Notes"
date: "2017-12-20"
categories: 
  - "temp"
tags: 
  - "data-structure"
  - "javascript"
---

# Javascript Data Structure Notes

## review:

* * *

### true,false value in javascript

| variable type | transform to boolean |
| --- | --- |
| undefined | false |
| null | false |
| boolean | true:true,false:false |
| number | +0/-0/NaN:false |
| String | is blank:false,else:true |
| Object | true |
| for example: | `(new Boolean(false))?'true':'false'` _result:'true'_ **tips:Object always is true** |

* * *

### core functions of Array

| Name | Description |
| --- | --- |
| concat | concatenate two or more arrays and return |
| every | implement function that given for every items util it is end or there is a return value is false and if all results are true,return true,else return false |
| some | difference from `every()` is that only if one result is true will return true |
| filter | implement function that given for every items and return array consists of items which return true |
| forEach | implement function that given for every items and no return value (**parameter:value,key,index**) |
| join | _concatenate_ all items in array _into_ single string |
| indexOf | return the index of item in array that is up to the parameter given,no item matched return -1 |
| lastIndexOf | _similar to_ `indexOf()` but return the max index matched |
| map | implement function that given for every items and all results will constitute a array |
| reverse | reverse items process in array |
| slice | return array that made up of items which indexes are range of parameters |
| sort | sort array by alphabets order and allow to pass sort methods as parameter of the function **tips:default in alphabets order,pass a compare function to sort in other way** |
| toString | return single string (or `toLocaleString()`) |
| valueOf | same as `toString()` |

* * *

### [Different ways to create Object in JavaScript](http://www.ruanyifeng.com/blog/2012/07/three_ways_to_define_a_javascript_class.html)

```null
/*way 1*/
function obj(){
    this.a = ''
    this.b = ''
    this.fun = function(){
        console.log(a)
    }
}
obj.prototype.foo = function(){
    console.log("here is foo")
}
var Obj = new obj()
/*
Functions Defined based on the prototype are shared by all instances of the Object  and to generate private functions in constructor.Try to define prototype functions to save memory and reduce the cost of instantiation.
*/

/*way 2*/
var obj = {
    a:'',
    b:'',
    fun:function(){
        console("here is fun")
    }
}
var Obj = Object.create(obj)

/*way 3*/
var Obj = {
    pub:'',
    createNew:function(){
        var obj = {}
        var pri = ''
        obj.a = ''
        obj.b = ''
        obj.fun = function(){
            console.log(pri)
        }
        return obj
    }
}
var ins = Obj.createNew()

/*way 4*/
class obj{
    constructor(a,b){
        this.a = a
        this.b = b
    }

    static fun(){
        console.log("here is fun")
    }
}
let Obj = new obj(1,2)
Obj.fun()
/*
class declarations are not hoisted
*/
```

* * *

### [Learn about Garbage Collectionin in javascript](https://developer.mozila.org/en-US/docs/Web/JavaScript/Memory_Management)

* * *

### Use functions `push()` and `pop()` of Object Array to emulate stack

* * *

### Use functions `unshift()` and `shift()` of Object Array to emulate queue

* * *

### Use `Object.keys(Obj)` or `for(var i in Obj)` to count keys in Obj

* * *

### Hash function and hash table [find more](http://goo.gl/VtdN2x)

```null
/*not the best but the most popular hash function djb2*/
var djb2HashCode = function(key){
    var hash = 5381
    for(var i = 0;i < key.length;i++){
        hash = hash * 33 + key.charCodeAt(i)
    }
    return hash % 1013
}
```

* * *

### More about Tree [Red-Black tree](http://goo.gl/OxED8K) and [Heap tree](http://goo.gl/SFlhW6) and [AVL tree](https://en.wikipedia.org/wiki/AVL_tree)

* * *

### `BFS` `Dijkstra's` `Bellman-Ford` `A*`

* * *

### common sort function

```null
function ArrayList(){
    var arr = []
    var swap = function(i,j){
        var temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    this.initial = function(array){
        for(var i = 0;i < array.length;i++)
            arr.push(array[i])
    }
    /*Bubble sort ascend*/
    this.bubbleSort = function(){
        if(arr.length < 2) return
        for(var i = 0;i < arr.length;i++){
            for(var j = 0;j < arr.length - 1 - i;j++){
                if(arr[j] > arr[j+1]) swap(j,j+1)
            }
        }
    }
    /*Select sort ascend*/
    this.selectSort = function(){
        if(arr.length < 2) return
        for(var i = 0;i < arr.length;i++){
            var min = i
            for(var j = i;j < arr.length;j++){
                if(arr[j] < arr[min]) min = j
            }
            if(arr[min] != arr[i])
                swap(i,min)
        }
    }
    /*Insert sort ascend*/
    this.insertSort = function(){
        if(arr.length < 2) return
        for(var i = 1;i < arr.length;i++){
            var k = i,
                temp = arr[i]
            while(k > 0 && temp < arr[k-1]){
                arr[k] = arr[k-1]
                k--
            }
            arr[k] = temp
        }
    }
    /*Merge sort ascend*/
    var mergeSortRec = function(array){
        if(array.length === 1) return array
        var mid = Math.floor(array.length / 2)
        var left = array.slice(0,mid)
        var right = array.slice(mid,array.length)
        return merge(mergeSortRec(left),mergeSortRec(right))
    }
    var merge = function(left,right){
        var array = []
        var i = 0,j = 0
        while(i < left.length && j < right.length){
            if(left[i] < right[j]){
                array.push(left[i])
                i++
            }
            else{
                array.push(right[j])
                j++
            }
        }
        while(i < left.length){
            array.push(left[i])
            i++
        }
        while(j < right.length){
            array.push(right[j])
            j++
        }
        return array
    }
    this.mergeSort = function(){
        if(arr.length === 1) return
        arr = mergeSortRec(arr)
    }
    /*Quick sort ascend*/
    var quickSort = function(){
        quick(arr,0,arr.length - 1)
    }
    var quickPartition = function(array,left,right){
        var center = Math.floor((left + right) / 2)
        var l = left
        var r = right
        while(l <= r){
            /*find bigger number from left of the array*/
            while(array[l] < array[center]){
                l++
            }
            /*find smaller number from right of the array*/
            while(array[r] > array[center]){
                r--
            if(l <= r){
                quickSortSwap(l,r)
                l++
                r--
            }
        }
        return l
    }
    var quick = function(array,left,right){
        if(array.length <= 1) return array
        var index = quickPartition(array,left,right)
        if(left < index - 1)
            quick(array,left,index - 1)
        if(right > index)
            quick(array,index,right)
    }
}
```
