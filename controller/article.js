const cfg = require('../config');
const articleOperator = require('../operator').articleOperator;
const genreOperator = require('../operator').genreOperator;
const linkOperator = require('../operator').linkOperator;
const messageOperator = require('../operator').messageOperator;
const sentenceOperator = require('../operator').sentenceOperator;
const moment = require('moment');
const markdown = require('markdown-it')();
moment.locale('zh-cn');


exports.link = function(req,res,next){
    let pageData = {};
    let linkGenres = linkOperator.getLinkByQuery({});
    let queryGenres = genreOperator.getGenreByQuery({});
    Promise.all([linkGenres,queryGenres]).then(function ([links,genres]) {
        pageData.pageTitle = '学习文档';
        pageData.links = links;
        pageData.genres = genres;
        pageData.pageSign = 'id-links';
        if(req.isMobile){
            res.render('m/links',pageData);
        }else{
            res.render('pc/links',pageData);
        }
    }).catch(function () {
        next()
    });
};
exports.senlist = function (req,res,next) {
    let query = {};
    let page = parseInt(req.query.page,10);
    page = page > 0 ? page : 1;
    let limit = parseInt(req.query.limit,10) || 20;
    let options ={skip: (page - 1) * limit, limit: limit, sort: {create_at:-1}};
    let querySentences = sentenceOperator.getSentenceByQuery(query,options);
    let queryCount = sentenceOperator.getCountByQuery(query);
    Promise.all([querySentences,queryCount]).then(function ([sentences,count]){
        let newArr = sentences.map((item)=>{
            let json={};
            json.create_at = moment(item.create_at).format('YYYY-MM-DD')
            json.content = markdown.render(item.content);
            return json;
        });
        res.json({
            state:1,
            message:'success',
            data:{
                totalCount:count,
                currentPage:page,
                sentences:newArr
            }
        })
    }).catch(function (err) {
        console.log(err);
        res.json({
            state:0,
            message:err,
            data:{}
        })
    })
};
exports.sentences = function(req,res,next){
    let queryGenres = genreOperator.getGenreByQuery({});
    Promise.all([queryGenres]).then(function ([genres]) {
        let pageData = {};
        pageData.pageTitle = '微笔记';
        pageData.genres = genres;
        pageData.pageSign = 'id-sentences';
        if(req.isMobile){
            res.render('m/sentence',pageData);
        }else{
            res.render('pc/sentence',pageData);
        }
    })
};


exports.message = function(req,res,next){
    let method = req.method.toLowerCase();
    if (method === 'get'){
        let pageData = {};
        let queryGenres = genreOperator.getGenreByQuery({});
        Promise.all([queryGenres]).then(function ([genres]) {
            pageData.pageTitle = '关于本站';
            pageData.genres = genres;
            pageData.pageSign = 'id-message';
            if(req.isMobile){
                res.render('m/message',pageData);
            }else{
                res.render('pc/message',pageData);
            }
        }).catch(function () {
            next()
        });
    }
    if(method === 'post'){
        let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
        let opt = {
            name:req.body.name,
            email:req.body.email,
            comment:req.body.comment
        };
        let editError = '';
        if (opt.name === '') {
            editError = '姓名不能是空的。';
        } else if (opt.email === '') {
            editError = '邮箱不可为空';
        } else if (opt.comment === '') {
            editError = '留言内容不可为空';
        }else if(!emailReg.test(opt.email)){
            editError = '邮箱格式不正确';
        }
        if (editError !== '') {
            res.json({
                state:0,
                message:editError,
                data:{}
            })
        }
        messageOperator.addNewMessage(opt).then(function () {
            res.json({
                state:1,
                message:'留言成功,请耐心等待回复',
                data:{}
            })
        }).catch(function () {
            res.json({
                state:0,
                message:'保存数据错误',
                data:{}
            })
        })
    }
};
exports.index = function(req,res,next){
    let pageData = {};
    let queryGenres = genreOperator.getGenreByQuery({});
    let latestArticles = articleOperator.getLatest({},10);
    Promise.all([queryGenres,latestArticles]).then(function ([genres,articles]) {
        articles.forEach(function (c,i,a) {
            a[i].create_time = moment(a[i].create_at).fromNow();
        });
        genres.sort(function (a,b) {
            return b.sort - a.sort
        });
        pageData.genres = genres;
        pageData.articles = articles;
        pageData.pageTitle = cfg.name;
        pageData.pageSign = 'id-index';
        if(req.isMobile){
            res.render('m/index',pageData);
        }else{
            res.render('pc/index',pageData);
        }
    }).catch(function () {
        next()
    });
};
exports.list = function (req,res,next) {
    let pageData = {};
    let page = parseInt(req.query.page,10);
    page = page > 0 ? page : 1;
    let genre = req.query.genre || 'all';
    let query = {};
    let queryGenre = genreOperator.getGenreByQuery(query);
    queryGenre.then(function(genres){
        genres.sort(function (a,b) {
            return b.sort - a.sort
        });
        pageData.genreString = genre;
        pageData.genres = genres;
        pageData.pageTitle = '所有文章' + '第' + page + '页';
        for(let i=0;i<genres.length;i++){
            if(genres[i].genreName ===  genre){
                query.genre = genres[i]._id;
                pageData.genre = genres[i];
                pageData.genreString = genres[i].genreName;
                pageData.pageTitle = genres[i].title + '第' + page + '页';
                break
            }
        }
        let limit = cfg.pageSize;
        let options ={populate:'genre', skip: (page - 1) * limit, limit: limit, sort: {create_at:-1}};
        let queryArticles = articleOperator.getArticleByQuery(query,options);
        let queryCount = articleOperator.getCountByQuery(query);
        let latestArticles = articleOperator.getLatest(query,8);
        Promise.all([queryArticles,queryCount,latestArticles]).then(function (result){
            pageData.articles = result[0];
            pageData.articles.forEach(function (c,i,a) {
                a[i].create_time = moment(a[i].create_at).fromNow();
            });
            pageData.latestArticles = result[2];
            pageData.pageSign = 'id-article';
            pageData.pages = {
                totalCount:result[1],
                numPerPage:limit,
                showPages:cfg.showPages,
                currentPage:page
            };
           if(req.isMobile){
                res.render('m/list',pageData);
            }else{
                res.render('pc/list',pageData);
            }
        }).catch(function (err) {
            next()
        })
    }).catch(function (err) {
        console.log(err)
    });
};
exports.details = function (req,res,next) {
    let pageData = {};
    let articleId = req.params.tid;
    let queryArticle = articleOperator.getArticleById(articleId);
    let addVisitor = articleOperator.addVisitor(articleId);
    Promise.all([queryArticle,addVisitor]).then(function (result) {
        pageData.pageTitle = result[0].title;
        pageData.article = result[0];
        pageData.article.create_time = moment(pageData.article).fromNow();
        pageData.article.content = markdown.render(pageData.article.content);
        let prevData = articleOperator.prevData(articleId,result[0].genre);
        let nextData = articleOperator.nextData(articleId,result[0].genre);
        let queryGenre = genreOperator.getGenreByQuery({});
        let latestArticles = articleOperator.getLatest({genre:result[0].genre._id},8);
        Promise.all([prevData,nextData,latestArticles,queryGenre]).then(function (resData) {
            pageData.genres = resData[3];
            pageData.latestArticles = resData[2];
            pageData.genreString = pageData.article.genre.genreName;
            pageData.prevData = resData[0];
            pageData.nextData = resData[1];
            pageData.pageSign = 'id-article';
            if(req.isMobile){
                 res.render('m/article',pageData);
             }else{
                 res.render('pc/article',pageData);
             }
        }).catch(function (err) {
            console.log(err);
            next()
        })
    }).catch(function (err) {
        console.log(err);
        next()
    });
};