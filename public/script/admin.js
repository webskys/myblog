$(function () {
    if (pageSign) {
        $("#" + pageSign).addClass('active')
    }
    $('#logout').click(function () {
        $.ajax({cache: false, url: '/admin/logout', type: 'post', data: {}, dataType: 'json'}).then(function (data) {
            if (data.state === 1) {
                alert('登出成功');
                window.location.reload()
            } else {
                alert(data.message)
            }
        }).catch(function () {
            alert("服务器错误，请稍后重试")
        })
    });
    $(document).on('change','#uploadfilebtn[type="file"]',function () {
        if($(this).val() !== '' && $(this).val() !== undefined){
            let formData = new FormData();
            formData.append('editormd-image-file',$(this).get(0).files[0]);
            $.showLoading();
            $.ajax({
                cache: false,
                url: '/admin/upload',
                type: 'post',
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
            }).then(function (result) {
                $.closeLoading();
                if(result.success === 1){
                    alert(result.message);
                    $('#uploadfileurl').val(result.url)
                }
                if(result.success === 0){
                    alert(result.message);
                }

            }).catch(function (err) {
                $.closeLoading();
                alert("服务器错误，请稍后重试")
            })
        }
    })


});
$.fn.showPages = function (params) {
    let $this = $(this);
    let options = {
        totalCount: 0,
        currentPage: 1,
        showPages: 7,
        onPageChange: null
    };
    $.extend(options, params);
    let numPerPage = requestData.limit
    let totalPages = Math.ceil(options.totalCount / numPerPage);
    let prevNum = Math.floor(options.showPages / 2);
    let nextNum = Math.floor(options.showPages / 2);
    if (totalPages <= options.showPages) {
        prevNum = options.currentPage - 1;
        nextNum = totalPages - options.currentPage;
    } else {
        if (options.currentPage <= prevNum) {
            prevNum = options.currentPage - 1;
            nextNum = options.showPages - options.currentPage
        }

        if (options.currentPage >= totalPages - nextNum) {
            nextNum = totalPages - options.currentPage;
            prevNum = options.showPages - nextNum - 1;
        }
    }
    if (totalPages > 1) {
        let pagesHtml = `<span class="firsepage ${ options.currentPage === 1?'disabled':'' }"  data-page="1"><i class="iconfont icon-doubleleft"></i>
                        </span><span class="page ${ options.currentPage === 1?'disabled':'' }"  data-page="${ options.currentPage - 1 > 0 ? options.currentPage-1 : 1 }"><i class="iconfont icon-left"></i>
                        </span>`;
        for(let i = 0;i < prevNum;i++){
            let pageNum = options.currentPage - prevNum + i;
            pagesHtml += `<span class="page"  data-page="${pageNum}">${pageNum}</span>`
        }
        pagesHtml += `<span class="page active"  data-page="${ options.currentPage}">${ options.currentPage}</span>`
        for(let i = 1;i <= nextNum;i++){
            let pageNum = options.currentPage + i
            pagesHtml += `<span class="page"  data-page="${pageNum}">${pageNum}</span>`
        }
        pagesHtml += `<span class="page ${ options.currentPage >= totalPages ? 'disabled':'' }"  data-page="${ options.currentPage < totalPages ? options.currentPage + 1 : totalPages }"><i class="iconfont icon-right"></i>
                      </span><span class="lastpage ${ options.currentPage >= totalPages ? 'disabled':'' }" data-page="${ totalPages }"><i class="iconfont icon-doubleright"></i></span>`;
        $this.html(pagesHtml);
        $this.off();
        $this.on('click', 'span', function() {
            let $el = $(this);
            if ($el.hasClass('disabled') || $el.hasClass('active')) {
                return;
            }
            requestData.page = parseInt($el.attr('data-page'),10)
            getArticles();
        });
        $this.css('display','block')
    } else {
        $this.empty().css('display','none')
    }

};
(function () {
    $.extend({
        showLoading: function () {
            if ($("#markLoading").length > 0) {
                $("#markLoading").css("display", "block");
            } else {
                $("<div id='markLoading' class='mark-loading'><div class='spinner'><div class='double-bounce1'></div><div class='double-bounce2'></div></div></div>").appendTo("body");
            }
        },
        closeLoading: function () {
            $("#markLoading").remove();
        }
    })
})();
$.fn.inputDefError = function(){
    let $this = $(this);
    let showdef = function(){
        return $this.html($this.attr('data-def'))
    };
    let showerror = function (text) {
        return $this.addClass('error').html(text)
    };
    showdef()
};