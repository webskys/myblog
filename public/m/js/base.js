window.onload = function () {
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, {
        passive: false  // 关闭被动监听
    });
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
};

$(function () {
    $("#reward").reward();
    $("#navBar").on('click',function () {
        $("#nav").addClass('on')
    });
    $(".nav-close").on('click',function () {
        $("#nav").removeClass('on')
    })
});
function closeBaseMask() {
    var loadingEle = document.getElementById('markLoading');
    loadingEle.style.display = 'none';
    loadingEle.style.opacity = '0'
}
function showBaseMask() {
    var loadingEle = document.getElementById('markLoading');
    loadingEle.style.display = '';
    loadingEle.style.opacity = '1'
}
$.fn.reward = function(){
    var $this = $(this);
    $this.on('click',function () {
        $reward = $("<div class=\"reward\"></div>")
        $template = "<div class='iconfont reward-close'>&#xe606;</div><div class='reward-t'>打赏</div><div class='reward-msg'>手留余香，功德无量，谢谢恩公赏点钱吧</div><div class='reward-it'><i class='iconfont reward-icon01'>&#xe63b;</i> 支付宝</div><div class='reward-con'><img src='/img/pay02.jpg'></div><div class='reward-it'><i class='iconfont reward-icon02'>&#xe63b;</i> 微信</div><div class='reward-con'><img src='/img/pay01.jpg'></div>"
        $reward.append($template)
        $('body').append($reward);
        $reward.css({'width':'100%','height':'100%','opacity':'100'});
        $(".reward-close").on('click',function () {
            $reward.remove()
        })
    })

};
$.fn.LiMask = function (opts) {
    var opt = {
        title:'提示信息',
        content:'这里是弹出框的内容',
        width:'90%',
        btnText:'确定',
        ok:function () {
            //alert('adfasdf');
        }
    };
    var options = $.extend({},opt,opts);
    var $this = this;
    var $mask = $(".dialog-mask").length > 0 ? $(".dialog-mask"):$("<div class='dialog-mask'></div>")
    var $container = $("<div class='dialog-container '></div>");
    var $title = $("<div class='dialog-title'>"+options.title+"</div>");
    var $content = $("<div class='dialog-content'></div>");
    var $buttonBox = $("<div class='dialog-btn-box'></div>");
    var $closeBtn = $("<div class='dialog-btn-close iconfont'>&#xe60a;</div>");
    var $button = $("<button type='button' class='dialog-btn'>"+ options.btnText +"</button>");

    var init = function(){
        $title.append($closeBtn);
        $buttonBox.append($button);
        $content.html(options.content);
        $container.append($title).append($content).append($buttonBox);
        $container.css('width',options.width);
        $this.append($mask).css('overflow','hidden');
        $mask.addClass('on');
        $this.append($container)
    };
    $closeBtn.add($button).bind('click',function () {
        $mask.removeClass('on');
        $container.remove();
        $this.css('overflow','auto');

    });
    init();
};