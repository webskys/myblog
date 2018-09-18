const cfg = require('../config');
const articleOperator = require('../operator').articleOperator;
const genreOperator = require('../operator').genreOperator;
const linkOperator = require('../operator').linkOperator;
const messageOperator = require('../operator').messageOperator;

exports.link = function(req,res,next){
    let linkGenres = linkOperator.getLinkByQuery({});
    Promise.all([linkGenres]).then(function ([links]) {
        res.render('links',{links:links});
    }).catch(function () {
        next()
    });
};
exports.message = function(req,res,next){
    let method = req.method.toLowerCase();
    if (method === 'get'){
        res.render('message');
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
                message:'发表留言成功',
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
    Promise.all([queryGenres]).then(function ([genres]) {
        genres.sort(function (a,b) {
            return b.sort - a.sort
        });
        pageData.genres = genres;
        pageData.pageTitle = '首页_' + cfg.name;
        res.render('index',pageData);
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
        pageData.pageTitle = '所有文章_' + cfg.name;
        for(let i=0;i<genres.length;i++){
            if(genres[i].genreName ===  genre){
                query.genre = genres[i]._id;
                pageData.genre = genres[i];
                pageData.genreString = genres[i].genreName;
                pageData.pageTitle = genres[i].title + '_' + cfg.name;
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
            pageData.latestArticles = result[2];
            pageData.pages = {
                totalCount:result[1],
                numPerPage:limit,
                showPages:cfg.showPages,
                currentPage:page
            };
            res.render('list',pageData);
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
        pageData.pageTitle = result[0].title + '_' + cfg.name;
        pageData.article = result[0];
        let prevData = articleOperator.prevData(articleId,result[0].genre);
        let nextData = articleOperator.nextData(articleId,result[0].genre);
        let queryGenre = genreOperator.getGenreByQuery({});
        let latestArticles = articleOperator.getLatest({genre:result[0].genre._id},8);
        Promise.all([prevData,nextData,latestArticles,queryGenre]).then(function (resData) {
            pageData.genres = resData[3];
            pageData.latestArticles = resData[2];
            pageData.prevData = resData[0];
            pageData.nextData = resData[1];
            res.render('article',pageData);
        }).catch(function (err) {
            console.log(err);
            next()
        })
    }).catch(function (err) {
        next()
    });
};