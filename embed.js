if (typeof jQuery === 'undefined') {
  throw new Error('Danmaco\'s JavaScript requires jQuery');
}


var urlLocation = location.href;

if(urlLocation.charAt(urlLocation.length - 1) === '#'){
	urlLocation = urlLocation.substr(0, urlLocation.length-1);
}

if(urlLocation.charAt(urlLocation.length - 1) === '/'){
	urlLocation = urlLocation.substr(0, urlLocation.length-1);
}

// create div
var danmacoDiv=$('<div id="danmaco"><div class="screen"><div class="s_dm"><div class="mask"></div>\
<div class="s_show"></div></div><div class="send">\
<div class="s_con"><input type="text" class="s_txt"/>\
<input type="button" class="s_btn" value="发表评论"/></div></div></div></div>');            
danmacoDiv.appendTo('body');   



// load style
$("<link>").attr({ rel: "stylesheet",type: "text/css",href: "https://danmako.sinaapp.com/style.css"}).appendTo("head");

var firebase;
$.ajaxSetup({cache: true});
// load firebase.js
$.getScript("https://cdn.firebase.com/js/client/2.2.1/firebase.js", function(){
	firebase = new Firebase('https://dazzling-fire-9662.firebaseio.com/'+ window.btoa(urlLocation));
	firebase.on('child_added',
    function (snapshot) {
        var message = snapshot.val();
        console.log(message);
        $(".s_show").append("<div>" + message + "</div>");
        init_screen();
  	});

});



//发表评论
$(".s_btn").click(function () {
    post();
});

$(".s_txt").keydown(function () {
    var code = window.event.keyCode;
    if (code == 13) {
        post();
    }
});

$(document).keydown(function(event){
	var keyCode = event.keyCode;
	if (keyCode == 13) {
        post();
    }else if(keyCode == 27){
    	$(".screen").toggle(600);
    }
});

function post() {
    var text = $(".s_txt").val();
    if (text) {
        $(".s_txt").val("");
        firebase.push(text);
    } else {
        $(".s_txt").focus();
    }
}




//初始化弹幕
function init_screen() {
    var _top = 0;

    $(".s_show").find("div").show().each(function () {
        var _left = $(window).width() - $(this).width();
        var _height = $(window).height();

        _top = _top + 80;

        if (_top > _height - 100) {
            _top = 80;
        }

        var time = 10000;
        if ($(this).index() % 2 == 0) {
            time = 20000;
        }
        //设定文字的初始化位置
        $(this).css({
            left: _left,
            top: _top,
            color: getRandomColor()
        });
        $(this).animate({
                left: "-" + _left + "px"
            },
            time,
            function () {

            });

    });
}

//随机获取颜色值
function getRandomColor() {
    return '#' + (function (h) {
            return new Array(7 - h.length).join("0") + h
        })((Math.random() * 0x1000000 << 0).toString(16))
}