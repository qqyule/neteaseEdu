/**
 * notice_module:顶部通知不再显示模块
 */
(function () {
	var notice_module = (function () {
		var notice = document.querySelector(".m-notice");
		var close = document.querySelector(".unnotice");
		var cookie = getCookie();
		var name = "unnotice" ;
		var value = "yes" ;
		//首选判断本地浏览器是否有为name的cookie
		if(cookie[name]!=value){
			notice.style.display="block";
		}
		addClickEvent(close,function (event) {
			setCookie(name,value);//不设置时间浏览器关闭后，cookie即会消失
			notice.style.marginTop = "-36px";
		});
	})();
})();
/**
 * attention_module : 关注与登录模块
 */
var attention_module = (function () {
	var fol = document.querySelector('.g-fol .follow');//关注
	var fold = document.querySelector('.followed');//已关注
	var login = document.querySelector('.m-login');//登录框
	var close = document.querySelector('.login .close');//关闭登录框
	var btn = document.querySelector('#login-form .login-btn');//提交按钮
	var login_url = "http://study.163.com/webDev/login.htm";//请求登录的url
	
	var error = document.querySelector('.login-error');//错误信息
	var  fol_url = "http://study.163.com/webDev/attention.htm";
	var cancel = document.querySelector('.followed .cac');
	//关注过的cookie
	var follow_name = "followSuc";
	var follow_value = "followed";
	//登录过的cookie
	var login_name = "loginSuc";
	var login_value = "successd";
	//1.首先判断是否有关注的cookie
	if(getCookie()[follow_name]==follow_value){
			//如果有显示已关注
			showFollowed();
	}
	//2.为关注按钮添加点击事件
	addClickEvent(fol,function () {
		if(getCookie()[login_name]==login_value){
			//显示已关注
			showFollowed();
		}
		else{
			//弹出登录框
			login.style.display = "block";
		}
	});
	//3.为登录框提交添加事件
	addClickEvent(btn,function () {
		var user	= document.querySelector('.user').value; //填写的用户名
		var pass	=  document.querySelector('.pass').value; //填写的密码
		var options = {userName:md5(user),password:md5(pass)};
		ajax_get(login_url,options,res_form);
	});
	//4. 为登录框的close关闭添加事件
	addClickEvent(close,function () {
		login.style.display = "none" ;
	})
	//5. 为取消关注添加事件
			addClickEvent(cancel,function () {
			fol.style.display = "block";
	 		fold.style.display = "none";
	 		setCookie(follow_name,"false");
			});		
	
	
	// 显示已关注函数
	function showFollowed() {
	 	fol.style.display = "none";
	 	fold.style.display = "block";
	 } 
	// 提交密码服务器验证的回调函数
	var res_form = function (response) {
		if(response=="1"){
			showFollowed();
			login.style.display = "none" ;
			setCookie(login_name,login_value);
			getFollow();
			
		}
		else{
			error.style.display = "block" ;
			alert('账号或密码错误');
		}
	}
	// 获取关注信息
	function getFollow() {
		ajax_get(fol_url,null,function (res) {
			console.log(res+":"+typeof res);
			if(res==1){
			setCookie(follow_name,follow_value);
			}
			else{
				alert("关注信息获取失败");
			}
		});
	}
})();

/**
 * 轮播图模块
 * 
 */
var banner_moudels = (function () {
	var banner = document.querySelector('.m-banner');
	var imgNodes = banner.getElementsByTagName('a');
	var buttons = banner.getElementsByTagName('span');//按钮
	var img_count = imgNodes.length;
	var totaltimer;
	var now_index = 0;//当前第几张图在显示
	var next = document.querySelector('.m-banner .arrow-right');
	var prev = document.querySelector('.m-banner .arrow-left');
	next.onclick = function () {
		clearInterval(totaltimer);
		now_index++;
		if(now_index>=imgNodes.length){
			now_index = 0;
		}
		startMove(now_index);
	}
	prev.onclick = function () {
		clearInterval(totaltimer);
		now_index--;
		if(now_index<=-1){
			now_index = imgNodes.length-1;
		}
		startMove(now_index);
	}
	function startMove(index) {
		for(var i=0;i<imgNodes.length;i++){
			buttons[i].className="";
			move(imgNodes[i],{opacity:0});
			imgNodes[i].style.display="none";
		}
		imgNodes[index].style.display="block";
		buttons[index].className="on";
		move(imgNodes[index],{opacity:100});
		now_index = index;
	}
	for(var i=0;i<buttons.length;i++){
		buttons[i].onclick=function () {
			if(now_index==this.getAttribute("data-index")){
				return ;
			}
			else{
				startMove(this.getAttribute("data-index"));
			}
		}
	}
	function play() {
		totaltimer = setInterval(function () {
			next.onclick();
		},5000)
	}
	
	banner.onmouseover=function () {
		clearInterval(totaltimer);
	}
	banner.onmouseout = play;
	play();
})();

/**
 * 生活区无限滚动模块
 */
var pictures = (function () {
	var g_pictures = document.getElementsByClassName('g-pictures')[0];
	var m_pictures = document.getElementsByClassName('m-pictures')[0];//ul区域
	//为ul复制li以形成无缝无限滚动
	m_pictures.innerHTML+=m_pictures.innerHTML;
	var list = m_pictures.getElementsByClassName('pic_list');//li区域
	//ul的宽度为li的个数*li的宽度
	m_pictures.style.width=list.length*(list[0].offsetWidth)+"px";
	//让ul区域一直向左运动，运动到ul的宽度一半时重新定位为0
	var object_value = -m_pictures.offsetWidth/2;
	var pic_timer = null;
	pic_timer=setInterval(startMove,10);
	function startMove() {
		var now_left = m_pictures.offsetLeft;
		if(now_left<=object_value){
			m_pictures.style.left = 0;
		}
		else{
			m_pictures.style.left = now_left-1+"px";
		}
	}
	g_pictures.onmouseover=function () {
		clearInterval(pic_timer);
	}
	g_pictures.onmouseout=function () {
		pic_timer=setInterval(startMove,10);
	}

})();


/**
 * 获取课程模块
 */
 var get_course = (function () {
 	var mnav = document.querySelector('.m-nav');//tab
 	var mnavTag = mnav.getElementsByTagName('a');//Tab下的标签区域
 	var mpager = document.querySelector('.m-pager');// 分页器区域
 	var templete = document.querySelector('.f-templete');//内容模板
 	//请求地址为
 	// var g_flow = document.querySelector('.g-flow');
 	// var g_width = parseInt(getStyle(g_flow,"width"));
 	// console.log(g_width);
 	var url = "http://study.163.com/webDev/couresByCategory.htm";
 	var initNum = 1;   // 当前页码 随点击的页码数变化 初始为1
 	var ty = 10; //种类 10代表产品设计 20代表编程语言，随tab标签的点击变化
 	var pz =  20;//请求每页返回数据20个 不变 宽屏为20 窄屏为15
 	var option = {pageNo:initNum,psize:pz,type:ty};
 	var pageNum = 8;//分页器个数
 	var lightNum = Math.floor(pageNum/2)+1;//保证第几个位置亮
 	//初始化调用ajax获取数据
 	ajax_get(url,option,drawCourse);
 	/**
 	 * 根据ajax返回的数据来进行DOM操作
 	 * @param  {[type]} response ajax返回的JSON对象
 	 * 
 	 */
 	function drawCourse(response) {
 		//将返回的JSON对象进行解析
 		var obj = JSON.parse(response);
 		// var totalCount = obj.totalCount;//返回的数据总数601 没有意义
 		// console.log("返回的数据总数"+totalCount);
 		var totalPage = obj.totalPage;//返回的数据总页数 宽屏31 窄屏41
 		// console.log("返回的数据总页数"+totalPage);
 		//var pageIndex = obj.pagination.pageIndex;//当前页数 当传入的页数大于
 		//10. 则一直为4  所以不再以此为数据
 		// console.log("返回的当前页数"+pageIndex);
 		// var totalPageCount = obj.pagination.totalPageCount;//总页数
 		// console.log("返回的总页数"+totalPageCount); 文档给的无效
 		var list = obj.list;
 		// console.log("内容个数："+ list.length);//由请求的pz决定 宽屏20 窄屏15
 		// 每次循环添加节点前首先删除templete所有兄弟节点
 		var coverNodes = document.getElementsByClassName('u-cover');
 		// console.log("删除前个数："+coverNodes.length);
 		for(var i =coverNodes.length-1;i>0;i--){//从最后一个开始删除,保留第一个
 			templete.parentNode.removeChild(coverNodes[i]);
 		}
 		// console.log("删除后个数："+coverNodes.length);
 		for(var i = 0;i<list.length;i++){
 			//对每一个list内容进行遍历然后添加到数据模板父节点下
 			var content = templete.cloneNode(true);
 			removeClass(content,"f-templete");
 			// var couresName = list[i].name;//课程名称
 			// var middlePhotoUrl = list[i].middlePhotoUrl;//课程图片url地址
 			// var provider = list[i].provider;//机构发布者
 			// var learnerCount = list[i].learnerCount;//在学人数
 			var price = list[i].price;//课程价格，0为免费
 			if(price==0){
 				price="免费"
 			}
 			else{
 				price="¥ "+price+".00";
 			}
 			var categoryName = list[i].categoryName;//课程分类
 			if(String(categoryName)=="null"){
 				categoryName="暂无";
 			}
 			var description = list[i].description;//课程描述
 			var img = content.getElementsByTagName('img')[0];
 			img.src = list[i].middlePhotoUrl;
 			img.alt = list[i].name;
 			var h3 = content.getElementsByTagName('h3')[0];
 			h3.innerText = list[i].name;
 			var org = content.getElementsByClassName('orgname')[0];
 			org.innerText = list[i].provider;
 			var num = content.getElementsByClassName('hot')[0];
 			num.innerText = list[i].learnerCount;
 			var kind = content.getElementsByClassName('kindname')[0];
 			kind.innerText = categoryName;
 			var desc = content.getElementsByClassName('disc')[0];
 			desc.innerText = list[i].description;
 			var pri = content.getElementsByClassName('pri')[0];
 			pri.innerText = price;
 			templete.parentNode.appendChild(content);
 		}
 	
 		page(totalPage,option.pageNo); //根据当前页码和总页数来绘制翻页器。
 	}
 	function page(tl,pi) {
 			//首先初始化
 			mpager.innerHTML = "";
			//如果总页数小于分页器的个数
			// if(tl<pageNum){
			// 	var prev = document.createElement("a");
			// 	prev.setAttribute("index",pi-1);
			// 	if(pi==1){
			// 		prev.className="prv f-dis";
			// 	}
			// 	else{
			// 		prev.className = "prv"; 
			// 	}
			// 	mpager.appendChild(prev);
			
			// 	for(var i = 1;i<=tl;i++){
			// 		var aNOde = document.createElement("a");
			// 		if(i==pi){
			// 			aNode.className=="pg selected"
			// 		}
			// 		else{
			// 			aNode.className = "pg" ;
			// 		}
			// 		aNode.setAttribute("index",i);
			// 		mpager.appendChild(aNode);
			// 	}
			// 	//在创建上下箭头节点
			
			// 	var next = document.createElement("a");
			// 	next.setAttribute("index",pi+1);
			// 	if(pi==tl){
			// 		next.className="prv f-dis";
			// 	}
			// 	else{
			// 		next.className="prv f-dis";
			// 	}
			// 	mpager.appendChild(next);
			// }
			//如果总页数大于分页器数目时
			//else{
				//先创建向上节点
				var prev = document.createElement("a");
				prev.innerText = "上一页";
				if(pi==1){
					prev.className="prv f-dis";
				}
				else{
					prev.className = "prv"; 
				}
				prev.setAttribute("index",pi-1);
				mpager.appendChild(prev);
				//console.log("分页器个数："+pageNum);
				//console.log("分页器亮的位置"+lightNum);
				//始终让分页器的第五个为选中状态
				//因为分页器个数为pageNum 8个 如果要保证pi是第五个位置
				//则必须满足当前页大于等于5否则第几页就是第几个选中位置
				//pi>=5 则第i个数为pi-5+i
				//同时要(总页数-当前页数)>=(分页器个数-保证第几个位置)
				//否则就让最后一页在最后一个位置，这一页在(分页器个数-(总页数-当前页))位置
				for(var i =1;i<=pageNum;i++){
					//①当前页小于=5 
					if(pi<=lightNum){
						var aNode = document.createElement("a");
						if(i==pi){
							aNode.className="pg selected"
						}
						else{
							aNode.className = "pg" ;
						}
						aNode.setAttribute("index",i);//1,2,3,4,5,6,7,8
						aNode.innerText = i;
						mpager.appendChild(aNode);
					}
					//②总页数-当前页数 小于 分页器-亮的位置 即最高为28 29 30 31
					//这种情况让总页数31页为最后一页
					else if((tl-pi)<=(pageNum-lightNum)){
						var aNode = document.createElement("a");
						if(tl-pageNum+i==pi){
							aNode.className="pg selected"
						}
						else{
							aNode.className = "pg" ;
						}
						aNode.setAttribute("index",tl-pageNum+i);//1,2,3,4,5,6,7,8
						aNode.innerText = tl-pageNum+i;
						mpager.appendChild(aNode);
					}
					else {
						var aNode = document.createElement("a");
						if(pi-lightNum+i==pi){
							aNode.className="pg selected"
						}
						else{
							aNode.className = "pg" ;
						}
						aNode.setAttribute("index",pi-lightNum+i);//1,2,3,4,5,6,7,8
						aNode.innerText = pi-lightNum+i;
						mpager.appendChild(aNode);
					}
				}
					
				//再创建下箭头节点
				var next = document.createElement("a");
				if(pi==tl){
					next.className="nxt f-dis";
				}
				else{
					next.className="nxt";
				}
				next.setAttribute("index",pi+1);
				mpager.appendChild(next);
				//初始化完毕后对每个按钮加上点击事件
				var nodes = mpager.getElementsByTagName('a');
				for(var i=0;i<nodes.length;i++){
					nodes[i].onclick = function () {
						var this_num = parseInt(this.getAttribute("index"));
						if(pi==this_num || this_num==0 || this_num==tl+1){
							return;
						}
						else{
							option.pageNo = this_num;
							ajax_get(url,option,drawCourse);
						}
						return false;//阻止a标签的默认行为
					}
				} 
			
 	}
 	/**
 	 * Tab 标签切换
 	 * 
 	 */
 	for(var i=0;i<mnavTag.length;i++){
 		mnavTag[i].onclick=function () {
 			for(var j=0;j<mnavTag.length;j++){
 				mnavTag[j].className="";
 			}
 			this.className="selected";
 		
 			if(parseInt(this.getAttribute("data"))!=option.type){
 				option.pageNo = initNum; 
 				option.type = parseInt(this.getAttribute("data"));
 				ajax_get(url,option,drawCourse);
 					console.log(option);
 			}
 			
 		

 		}
 	}
 	
 })();
/**
 * 最热排行模块
 */

var topHot_moudel = function () {
	var ulNode = document.querySelector('.m-toplit');
	var liNode = ulNode.getElementsByTagName("li");
	var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
	var li_templete = document.querySelector('.item');
	ajax_get(url,null,drawHot);
	function drawHot(response) {
		var data = JSON.parse(response);
		for(var i=0;i<data.length;i++){
			var liClone = li_templete.cloneNode(true);
			removeClass(liClone,"f-templete");
			var img = liClone.querySelector('.imgpic');
			img.src = data[i].smallPhotoUrl;
			img.alt = data[i].name;
			var h3 = liClone.querySelector('.tt');
			h3.innerText = data[i].name;
			var count = liClone.querySelector('.num');
			count.innerText = data[i].learnerCount;
			li_templete.parentNode.appendChild(liClone);
		}
	}
	//热门推荐 每隔5秒更新一门课程
	//整体思路：每次克隆最后一个节点然后加到第一个非模板的节点前面，
	//然后向下运动一个标签距离后，再删除最后一个节点，同时
	//定位恢复到之前
			function startMove() {
				var cloneLi = liNode[20].cloneNode(true);//因为模板也算一个节点
				ulNode.insertBefore(cloneLi,liNode[1]);
				move(ulNode,{bottom:-990},function () {
					ulNode.removeChild(liNode[21]);
					ulNode.style.bottom="-900px";
				});
			}
			setInterval(startMove,5000);

}();

/**
 * 视频播放模块
 */
var viedeo_moudel = (function () {
	var img_pic = document.querySelector('.playbox .imgpic');//图片
	var video = document.querySelector('.m-video');//视频区域
	var v_content = document.querySelector('#movie');
	var close_v = document.querySelector('.m-video .close');
	addClickEvent(img_pic,showVideo);
	function showVideo() {
		video.style.display = "block";
		if(v_content.paused){
			v_content.play();
		}
	}
	addClickEvent(close_v,function () {
		v_content.pause();
		video.style.display = "none";
	});
})();