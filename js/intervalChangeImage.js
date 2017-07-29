/**
 * Created by Administrator on 2017/7/13.
 */
// html中<img>标签和<i>标签放在同一个容器中,修改传入容器的id即可
var id = 'container';  //修改这里
var imgFlag = 0,timer = null;
window.onload = function () {
    var img = document.getElementById(id).getElementsByTagName('img');
    var btn = document.getElementById(id).getElementsByTagName('i');
    for(var i = 0;i < img.length;i++){
        btn[i].index = i;
        btn[i].onmouseover = function () {
            imgFlag = this.index - 1;
            clearTimeout(timer);
            changeImg();
        }
    }
    changeImg();
}
function changeImg() {
    var img = document.getElementById(id).getElementsByTagName('img');
    var btn = document.getElementById(id).getElementsByTagName('i');
    for(var j = 0;j < img.length;j++){
        img[j].style.opacity = 0;
        btn[j].style.background = '#eeeeee';
    }
    if(imgFlag < img.length - 1){
        imgFlag++;
    }else{
        imgFlag = 0;
    }
    img[imgFlag].style.opacity = '1';
    btn[imgFlag].style.background = '#cccccc';
    timer = setTimeout(changeImg,5000);
}