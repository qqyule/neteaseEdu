/**
 *获取实际样式函数
 * @param   {Object} obj  需要获取样式的对象
 * @param   {String} attr 获取的样式名
 * @returns {String} 获取到的样式值
 */
function getStyle(obj, attr) {
    //IE写法
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
        //标准
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}
/**
 * 获取cookie
 * @return {[Object]} 返回一个cookie的对象，以cookie[name]的形式访问
 */
function getCookie() {
    var cookie = {};
    var all = document.cookie;
    if (all === '') return cookie;
    var list = all.split('; ');
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
/**
 * [setCookie 设置cookie]
 * @param {[String]} name
 * @param {[String]} value
 * @param {[String]} expires
 * @param {[String]} path
 * @param {[String]} domain
 * @param {[String]} secure
 */
function setCookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
/**
 * [preventDefault 对IE的兼容]
 * 阻止默认行为
 */
function preventDefault(event){
    if(event.preventDefault){
        event.preventDefault();
    }else{    
        event.returnValue = false;
    }
}
/**
 * [Ajax get请求函数封装]
 * @param  {String}   url      [请求地址]
 * @param  {Object}   options  [请求的参数必须为{a:"",b,""}类型]
 * @param  {Function} callback [请求成功后要执行回调函数，接收参数为服务器返回来的数据]
 */
function ajax_get(url,options,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                callback(xhr.responseText);
            } else {
                console.error('Request was unsuccessful: ' + xhr.status);
            }
        };
    }
    if (!!options) {
        var url = url + '?' + serialize(options);
    };
    xhr.open("get",url,true);
    xhr.send(null);

    function serialize(data){
        if (typeof data == 'object') {
            var str = '';
            for (var key in data) {
                str += key + '=' + data[key] + '&';
            }
            data = str.replace(/&$/, '');
        }
        return data ;
    }
}

/**
 * 运动框架实现功能：
 *1.任意属性值的改变如width,heigt,opacity...
 *2.多个物体(元素)运动：如ul的所有li依次滑过都改变
 *3.多个属性值同时运动：如width,height同时改变
 *3.链式运动：如先改变width再改变height
 * @param  {Htmlelment}   obj  obj是传入进来的html元素对象
 * @param  {object}   json json={width:300,height:400,...}传入要改变的属性名称(width不加“”)以及该属性要改变到的终点值
 * @param  {Function} fn   fn是回调函数,如果需要链式运动需传入如move(this,{width:400},move(this,{heigth,400}))
 */
function move(obj,json,fn) {
    clearInterval(obj.timer);
    obj.timer=setInterval(function () {
        var flag = true ;
        for(var attr in json){
            var attr_value = 0;
            if(attr=='opacity'){
                attr_value = Math.round((parseFloat(getStyle(obj,attr)))*100);
            }
            else{
                attr_value = parseInt(getStyle(obj,attr));
            }
            if(attr_value!=json[attr]){
                flag = false;
                var speed = (json[attr]-attr_value)/20;
                speed = (speed>0)?Math.ceil(speed):Math.floor(speed);
                attr_value = attr_value+speed;
                if(attr=='opacity'){
                    obj.style.opacity = attr_value/100;
                    obj.style.filter = "alpha(opacity:"+attr_value+")";
                }
                else{
                    obj.style[attr] = attr_value+"px";
                }
            }
        }
        if(flag){
            clearInterval(obj.timer);
            if(fn){
                fn();
            }
        }
    },20)
}
/**
* 判断是否有某个className
* @param {HTMLElement} element 元素
* @param {string} className className
* @return {boolean}
*/
function hasClass(element, className) {
    var classNames = element.className;
    if (!classNames) {
        return false;
    }
    classNames = classNames.split(/\s+/);
    for (var i = 0, len = classNames.length; i < len; i++) {
        if (classNames[i] === className) {
            return true;
        }
    }
    return false;
}
/**
* 删除元素className
* @param {HTMLElement} element 元素
* @param {string} className className
*/
function removeClass(element, className) {
    if (className && hasClass(element, className)) {
        var classNames = element.className.split(/\s+/);
        for (var i = 0, len = classNames.length; i < len; i++) {
            if (classNames[i] === className) {
                classNames.splice(i, 1);
                break;
            }
        }
    element.className = classNames.join(' ');
    }
}