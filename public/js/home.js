(function() {
    var width, height, canvas, ctx, circles, target, animateHeader = true;
    initHeader();
    addListeners();
    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: 0, y: height};
        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create particles
        circles = [];
        for(var x = 0; x < width*0.5; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
    }

    // Event handling
    function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function scrollCheck() {
        if(document.body.scrollTop > height){
            animateHeader = false;
        }else{
            animateHeader = true;
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function() {
            _this.pos = {};
            init();
        })();

        function init() {
            _this.pos.x = Math.random()*width;
            _this.pos.y = Math.random()*height;
            _this.alpha = 0.1+Math.random()*0.3;
            _this.scale = 0.1+Math.random()*0.3;
            _this.velocity = Math.random();
        }
        this.draw = function() {
            if(_this.alpha <= 0) {
                init();
            }
            _this.pos.y -= _this.velocity;
            _this.alpha -= 0.0005;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
            ctx.fill();
        };
    }

})();
/*$(function () {
    let bgImages =[];
    for(let i=0;i<8;i++){
        let url = '/images/bg/bg-' + Math.ceil(Math.random()*20) +'.jpg';
        bgImages.push(url);
    }
    bgImages = [...new Set(bgImages)];
    const preloadImage = function (path) {
        return new Promise(function (resolve, reject) {
            const image = new Image();
            image.onload  = function () {
                resolve()
            };
            image.onerror = function () {
                reject()
            };
            image.src = path;
        });
    };
    async function imagesLoaded(arr) {
        let temparr = [];
        for(let i=0;i<arr.length;i++){
            await preloadImage(arr[i]).then(function () {
                temparr.push(arr[i])
            }).catch(function () {
                console.log('图片--' + i + '--加载错误')
            });
        }
        return temparr
    }
    imagesLoaded(bgImages).then(function (arr) {
        bgImages = arr;
        setBackground();
    }).catch(function () {
        console.log('加载图片错误')
    });
    function setBackground() {
        if(bgImages.length > 0){
            $("#home-warp").css("background-image","url("+ bgImages[0] +")");
        }
        if(bgImages.length > 1){
            setTimeout(f(),8000)
        }
    }
    let f = function changeBackground() {
        let total = bgImages.length;
        let i = 0;
        return function fn(){
            i++;
            if(i>=total){
                i = 0
            }
            $("#home-warp").css("background-image","url("+ bgImages[i] +")");
            setTimeout(fn,8000)
        }
    }
});*/

