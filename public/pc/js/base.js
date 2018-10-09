function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g,function(c){
        return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];
    });
}
String.prototype.render = function (context) {
    return this.replace(/{{(.*?)}}/g, (match, key) => context[key.trim()]);
};

$(function () {
    if (typeof pageSign) {
        $("#" + pageSign).addClass('active')
    }
    /*gotop*/
    var $gotop = $('<div class="scrolltop"></div>');
    $('body').append($gotop);
    showtop();
    $(window).on('scroll',showtop);
    $(".scrolltop").click(function(event){
        event.preventDefault();
        $('body,html').animate({scrollTop:0},200);
    });
    function showtop (){
        if($(this).scrollTop() > 80){
            $("#header").addClass('active')
        }else{
            $("#header").removeClass('active')
        }
        if($(this).scrollTop() > 200){
            $gotop.addClass('active')
        }else{
            $gotop.removeClass('active')
        }
    };
    $("#reward").click(function () {
        $('body').LiMask({
            title:'打赏',
            content:rewardHtml,
            btnText:'我不是土豪',
            width:745

        });
    })
});
$.fn.LiMask = function (opts) {
    var opt = {
        title:'提示信息',
        content:'这里是弹出框的内容',
        width:520,
        btnText:'确定',
        ok:function () {
            alert('adfasdf');
        }
    };
    var options = $.extend({},opt,opts);
    var $this = this;
    var $mask = $(".dialog-mask").length > 0 ? $(".dialog-mask"):$("<div class='dialog-mask'></div>")
    var $container = $("<div class='dialog-container '></div>");
    var $title = $("<div class='dialog-title'>"+options.title+"</div>");
    var $content = $("<div class='dialog-content'></div>");
    var $buttonBox = $("<div class='dialog-btn-box'></div>");
    var $closeBtn = $("<div class='dialog-btn-close'>×</div>");
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
var rewardHtml = "<div class='reward-msg'>手留余香，功德无量，谢谢恩公赏点钱吧</div><div class='cl'><div class='reward-i fl'><div class='reward-it'><i class='iconfont reward-icon01'>&#xe63b;</i> 支付宝</div><div class='reward-con'><img src='/img/pay02.jpg'></div></div><div class='reward-i fl'><div class='reward-it'><i class='iconfont reward-icon02'>&#xe63b;</i> 微信</div><div class='reward-con'><img src='/img/pay01.jpg'></div></div></div>"
var loadingHtml = "<div id='markLoading' class='mark-loading'><div class='spinner'><div class='double-bounce1'></div><div class='double-bounce2'></div></div></div>"
$.extend({
    showLoading: function () {
        var $loading = $(loadingHtml)
        $('body').append($loading)
        $("#markLoading").css({
            'display':'block',
            'opacity':'1'
        })

    },
    closeLoading: function () {
        $("#markLoading").remove()
    }
});