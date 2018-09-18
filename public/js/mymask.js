(function ($) {
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
    $.fn.aside = function (opts) {
        var opt = {};
        var options = $.extend({},opt,opts);
        var $this = this;






        var $conhall = $('<div class="contenthall"></div>');
        var $contextclose = $('<div class="bigclose"></div>');


        var $asidemask = $('<aside class="aside-mask"></aside>');
        var $aside = $('<aside class="aside-nav"></aside>');
        var $asideopen = $('<div class="aside-nav-open"></div>');
        var $asideclose = $('<div class="aside-nav-close"></div>');
        var $nav = $('<div class="aside-nav-con"></div>');

        var $home = $('<div class="aside-nav-bar"><span class="aside-text">返回首页</span><span class="aside-home"></span></div>');
        var $link = $('<div class="aside-nav-bar"><span class="aside-text">工具资源</span><span class="aside-link"></span></div>');
        var $message = $('<div class="aside-nav-bar"><span class="aside-text">留言</span><span class="aside-message"></span></div>');




        $nav.append($home).append($link).append($message);
        $aside.append($asideclose).append($nav);
        $this.append($aside).append($asideopen).append($conhall).append($contextclose);


        $asideopen.bind('click',function () {
            $aside.add($(this)).addClass('on')

        });
        //边侧关闭按钮
        $asideclose.bind('click',function () {
            $aside.add($asideopen).removeClass('on');
            $asidemask.removeClass('on');
            clearBarActive();
            closebigclosebar();
            clearhall();

        });
        //边侧导航公共按钮
        $(".aside-nav-bar").bind('click',function () {
            clearBarActive();
            closebigclosebar();
            clearhall();
            openContent($(this));
        });
        //关闭弹出的内容
        $contextclose.bind('click',function () {
            clearBarActive();
            closebigclosebar();
            clearhall();
            $asidemask.removeClass('on');

        });




        /*首页*/
        $home.bind('click',function () {
            window.location.href = '/'
        });
        /*工具资源*/
        $link.bind('click',function () {
            $.showLoading();
            clearhall();
            $.ajax(
                {
                    cache: false,
                    url: '/links',
                    type: 'get',
                    context: $conhall,
                    dataType: 'html'
                }
            ).then(function (html) {
                $(this).html(html);
                $(this).addClass('on');
                $.closeLoading();
                showbigclosebar();
            }).catch(function () {
                
            })
        });
        /*留言*/
        $message.bind('click',function () {
            $.showLoading();
            clearhall();
            $.ajax(
                {
                    cache: false,
                    url: '/message',
                    type: 'get',
                    context: $conhall,
                    dataType: 'html'
                }
            ).then(function (html) {
                $(this).html(html);
                $(this).addClass('on');
                $.closeLoading();
                showbigclosebar();
            }).catch(function () {

            })

        });




        var showbigclosebar = function () {
            $contextclose.css('display','block')
        };
        var closebigclosebar = function () {
            $contextclose.css('display','none')
        };
        var clearhall = function () {
            $conhall.removeClass('on')
            $conhall.empty()
        };
        var openContent = function (el) {
            $('.aside-mask') > 0 ? null : $this.append($asidemask);
            $asidemask.addClass('on');
            el.addClass('active');
        };
        var clearBarActive = function () {
            $(".aside-nav-bar").removeClass('active');
        };
    }
})(jQuery);