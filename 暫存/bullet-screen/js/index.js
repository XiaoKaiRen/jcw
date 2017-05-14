$(document).ready(function(){
	 //创建数据库引用
	var config = {
		authDomain:"codepen-bulletscreen.wilddog.com",
		syncURL: "https://codepen-bulletscreen.wilddogio.com"
	};
	wilddog.initializeApp(config);
	var ref = wilddog.sync().ref();
	var nb = 0;
	var arr = [];
	var kid = [];
	
	// “发射”按钮
	$(".btn1").click(function(){
		var text = $(".input-send").val();
		var hk = sgarray(arr,text)
		if (hk == -1 )
		{
		console.log(hk);
    	kid.push(nb);
		console.log(text);
		ref.child("message").push(text);
		nb+=1
		}
		else
		{
			tobigger(kid[sgarray(arr,text)])
		}
	});

	// input 回车触发“发射”按钮
	$(".input-send").keypress(function(event){
		if(event.keyCode == "13"){
			$(".btn1").trigger("click");
		}
	});

	// “清屏”按钮
	$(".btn2").click(function(){
		ref.remove();
		arr = [];
		kid = [];
		nb = 0
		$(".show").empty();
	});

	


	// 监听云端数据增加
	ref.child("message").on("child_added", function(snapshot){
		var text = snapshot.val();
		arr.push(text);
		var textObj = $("<div id=" + kid[sgarray(arr,text)] + " class=\"dm_message\"></div>");
		textObj.text(text);
		$(".show").append(textObj);
		moveObj(textObj);
	});

	// 监听云端数据删除
	ref.child("message").on("child_removed", function(snapshot){
		arr = [];
		$(".show").empty();
	});

	// 弹幕动作
	var topMin = $(".bullet-screen").offset().top;
	var topMax = topMin + $(".bullet-screen").height();
	var _top = topMin;

	var moveObj = function(obj){
		var _left = $(".bullet-screen").width() - obj.width();
		_top = Math.random()*1000;
		if(_top > (topMax - 1)){
			_top = topMin;
		}
		
		obj.css({left: _left,top: _top,color: getRandomColor()});
    
		var time = 20000 + 10000 * Math.random();
		
		obj.animate({left: "-" + _left + "px"}, time, function(){
			  obj.remove();
			  arr.splice(sgarray(arr,obj.text))
			  kid.splice(sgarray(arr,obj.text))
			  
		});
	}

	// 生成随机颜色
	var getRandomColor = function(){
		return '#' + ("00000" + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
	}
	var tobigger = function(id){
		nh = $('#'+id).css('top');
		nw = $('#'+id).css('font-size');
		
		nh = nh.replace('px','');
		nw = nw.replace('px','');
		
		nh = Number(nh)-10;
		nw = Number(nw)+10;
		
		document.getElementById(id).style.fontSize=nw +'px';
		document.getElementById(id).style.top = nh+'px'
	}
	
	var sgarray = function(arra,ts){
		for (var i = 0; i < arra.length; i++) {
			console.log(arra[i] +'==' +ts);
	    	if (arra[i] == ts)
	    	{
	    		
	    		return i;
	    	}
		}
		console.log('Flase');
		return -1
	}

	// 每3s随机选取一条消息播放
	//var getAndRun = function(){
	//	if(arr.length > 0){
	//		var n = Math.floor(Math.random() * arr.length + 1) - 1;
	//		var textObj = $("<div class=\"dm_message\">" + arr[n] + "</div>");
	//		$(".show").append(textObj);
	//		moveObj(textObj);
	//	}
	//	setTimeout(getAndRun, 30000);
//	}

	jQuery.fx.interval = 50;
	getAndRun();
});