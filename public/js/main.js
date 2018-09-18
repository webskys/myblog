$(function () {
    var $gotop = $('<div class="scrolltop"></div>');
    $('body').append($gotop);
    showtop();
    $(window).on('scroll',showtop);
    $('body').aside();

    function showtop (){
        if($(this).scrollTop() > 200){
            $gotop.addClass('active')
        }else{
            $gotop.removeClass('active')
        }
    };

    $(".scrolltop").click(function(event){
        event.preventDefault();
        $('body,html').animate({scrollTop:0},200);
    });

    $('#searchbtn').click(function () {
        $('body').LiMask({content:'搜索功能尚未完善'});
    })
});
(function () {
    $.extend({
        showLoading: function () {
            $("#markLoading").css({
                'display':'block',
                'opacity':'1'
            })
        },
        closeLoading: function () {
            $("#markLoading").css({
                'display':'none',
                'opacity':'0'
            })
        }
    })
})();
