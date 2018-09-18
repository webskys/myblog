const cfg = require('../config');
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const sha1 = require('sha1');
const adminOperator = require('../operator').adminOperator;
const articleOperator = require('../operator').articleOperator;
const genreOperator = require('../operator').genreOperator;
const linkOperator = require('../operator').linkOperator;
const messageOperator = require('../operator').messageOperator;





exports.index = function (req,res) {
    let pageData = {};
    pageData.pageTitle = '后面管理首页';
    pageData.pageSign = 'indexPage';
    res.render('admin/index',pageData);
};

//显示登录页
exports.showLogin = function (req,res) {
    let pageData = {};
    pageData.pageTitle = '管理员登录';
    res.render('admin/login',pageData);
};
//登录请求页
exports.login = function (req,res) {
    let userName = validator.trim(req.body.userName);
    let password = validator.trim(req.body.pass);
    if (!userName || !password) {
        return res.json({
            state:0,
            message:'信息不完整',
            data:{}
        })
    }
    let checkLogin = adminOperator.checkUser(userName);
    checkLogin.then(function (user) {
        if(user == null  || !user){
            return res.json({
                state:0,
                message:'用户名错误',
                data:{}
            })
        }
        if (sha1(password) !== user.password) {
            return res.json({
                state:0,
                message:'密码错误',
                data:{}
            })
        }else{
            // 用户信息写入 session
            req.session.user = user;
            return res.json({
                state:1,
                message:'登录成功',
                data:{}
            })
        }
    }).catch(function (err) {
        res.json({
            state:0,
            message:err,
            data:{}
        })
    })
};
//退出登录
exports.loginOut = function(req, res) {
    req.session.destroy();
    res.clearCookie(cfg.session.name, { path: '/' });
    return res.json({
        state:1,
        message:'登出成功',
        data:{}
    })
};

//管理员
exports.manager = function (req,res) {
    let pageData = {};
    pageData.pageTitle = '管理员列表';
    pageData.pageSign = 'managerPage';
    res.render('admin/manager',pageData);
};
//添加管理员
exports.addManager = function (req,res) {
    return res.json({
        state:1,
        message:'添加管理员成功',
        data:{}
    })
};
//删除管理员
exports.removeManager = function (req,res) {
    return res.json({
        state:1,
        message:'删除管理员成功',
        data:{}
    })
};
//修改管理员
exports.modifyManager = function (req,res,next) {
    return res.json({
        state:1,
        message:'删除管理员成功',
        data:{}
    })
};
//文章列表
exports.article = function(req,res){
    let pageData = {};
    pageData.pageTitle = '文章管理';
    pageData.pageSign = 'articlePage';
    res.render('admin/article',pageData);
};
//ajax请求文章列表
exports.articleList = function(req,res){
    let query = {};
    let page = parseInt(req.body.page,10);
    page = page > 0 ? page : 1;
    let limit = parseInt(req.body.limit,10) || 20;
    if(req.body.genre){
        query.genre = req.body.genre
    }
    let options ={populate:'genre', skip: (page - 1) * limit, limit: limit, sort: {create_at:-1}};
    let queryArticles = articleOperator.getArticleByQuery(query,options);
    let queryCount = articleOperator.getCountByQuery(query);
    Promise.all([queryArticles,queryCount]).then(function (result){
        res.json({
            state:1,
            message:'success',
            data:{
                totalCount:result[1],
                currentPage:page,
                articles:result[0]
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
//修改文章
exports.modifyArticle = function(req,res,next){
    let method = req.method.toLowerCase();
    if(method === "get"){
        let pageData = {};
        let articleId = req.params.tid;
        let queryGenre = genreOperator.getGenreByQuery({});
        let queryArticle = articleOperator.getArticleById(articleId);
        Promise.all([queryGenre,queryArticle]).then(function ([genres,article]) {
            pageData.article = article;
            pageData.genres = genres;
            pageData.pageTitle = '修改文章';
            pageData.pageSign = 'articlePage';
            res.render('admin/modifyArticle',pageData);
        }).catch(function (err) {
            next()
        });
    }
    if( method === "post" ){
        let id = req.body.id;
        if(req.body.title === '' || req.body.genre === '' || req.body.content === ''){
            res.json({
                state:0,
                message:'文章标题、分类以及详情不能为空',
                data:{}
            })
        }else {
            let opt = {
                title:req.body.title,
                brief:req.body.brief,
                genre:req.body.genre,
                icon:req.body.icon,
                content:req.body.content
            };
            let article = articleOperator.articleUpdate(id,opt);
            article.then(function(article){
                res.json({
                    state:1,
                    message:'文章修改成功',
                    data:{}
                })
            }).catch(function () {
                console.log(err);
                res.json({
                    state:0,
                    message:err,
                    data:{}
                })
            })
        }
    }
};
//添加文章
exports.addArticle = function(req,res,next){
    let method = req.method.toLowerCase();
    if (method === 'get'){
        let pageData = {};
        let queryGenre = genreOperator.getGenreByQuery({});
        queryGenre.then(function (genres) {
            pageData.genres = genres;
            pageData.pageTitle = '添加文章';
            pageData.pageSign = 'articlePage';
            res.render('admin/addArticle',pageData);
        }).catch(function (err) {
            next()
        });
    }
    if (method === 'post'){
        let opt = {
            title:req.body.title,
            brief:req.body.brief,
            icon:req.body.icon,
            genre:req.body.genre,
            content:req.body.content
        };
        // 验证
        let editError = '';
        if (opt.title === '') {
            editError = '标题不能是空的。';
        }else if (opt.genre === undefined || opt.genre === '') {
            editError = '请选择文章类型';
        } else if (opt.content === '') {
            editError = '内容不可为空';
        }
        if (editError !== '') {
            res.json({
                state:0,
                message:editError,
                data:{}
            })
        }
        articleOperator.addNewArticle(opt).then(function (article) {
            res.json({
                state:1,
                message:'文章添加成功',
                data:article._id
            })

        }).catch(function () {
            console.log(err);
            res.json({
                state:0,
                message:err,
                data:{}
            })
        })
    }
};
//删除文章
exports.deleteArticle = function(req,res,next){
    let id = req.params.tid;
    articleOperator.deleteArticleById(id).then(function () {
        res.json({
            state:1,
            message:'删除成功',
            data:{}
        })
    }).catch(function (err) {
        res.json({
            state:0,
            message:err,
            data:{}
        })
    })
};
//上传文件
exports.uploadFile = function(req,res,next){
    let file = req.file;
    let fileExt=file.originalname.replace(/.+\./,"");
    fs.rename(file.path, path.join(__dirname,'../public/uploadfiles/') + file.filename+'.'+fileExt, function(err) {
        if (err) {
            res.json({
                success : 0,
                message : "上传失败",
                url     : ''
            })
        }
        res.json({
            success : 1,
            message : "图片上传成功",
            url     : '/uploadfiles/'+file.filename + '.' + fileExt
        })
    })
};
//分类管理列表
exports.genre = function(req,res,next){
    let pageData = {};
    let queryGenres = genreOperator.getGenreByQuery({});
    let queryArticleGenreCount = articleOperator.getArticleGenreCount();

    Promise.all([queryGenres,queryArticleGenreCount]).then(function ([genres,groups]) {
        for (let i=0;i<genres.length;i++){
            genres[i].count = 0;
            for (let j=0;j<groups.length;j++){
                if(groups[j]._id.toString() === genres[i]._id.toString()){
                    genres[i].count = groups[j].count
                }
            }
        }
        pageData.pageTitle = '文章分类管理';
        pageData.pageSign = 'genrePage';
        pageData.genres = genres;
        res.render('admin/genre',pageData);
    }).catch(function (err) {
        next(err)
    });
};
//添加分类
exports.addGenre = function(req,res,next){
    let method = req.method.toLowerCase();
    if (method === 'get'){
        let pageData = {};
        pageData.pageTitle = '添加分类';
        pageData.pageSign = 'genrePage';
        res.render('admin/addGenre',pageData);
    }
    if(method === 'post'){
        let opt = {
            title:req.body.title,
            genreName:req.body.genreName,
            isNav:req.body.isNav,
            icon:req.body.icon,
            sort:req.body.sort
        };
        // 验证
        let reg = /^[a-zA-Z]+$/;
        let dreg = /^(0|[1-9][0-9]*)$/g;
        let editError = '';
        if (opt.title === '') {
            editError = '分类名称不能是空的。';
        }else if (opt.isNav === undefined || opt.isNav === '') {
            editError = '是否在导航显示不可为空';
        } else if (opt.genreName === '') {
            editError = '分类路径不可为空';
        } else if (opt.icon === '') {
            editError = '分类图标不可为空';
        }else if(!reg.test(opt.genreName)){
            editError = '路径只能用英文字母'
        }else if(!dreg.test(opt.sort)){
            editError = '排序只能为数字'
        }
        if (editError !== '') {
            res.json({
                state:0,
                message:editError,
                data:{}
            })
        }
        let queryGenres = genreOperator.getGenreByQuery({});
        queryGenres.then(function (genres) {
            let addError = false;
            for(let i=0; i<genres.length;i++){
                if(genres[i].title === opt.title || genres[i].genreName === opt.genreName){
                    addError = true;
                    break
                }
            }
            if(addError){
                res.json({
                    state:0,
                    message:'分类名称或路径己被占用',
                    data:{}
                })
            }else{
                genreOperator.addNewGenre(opt).then(function (genre) {
                    res.json({
                        state:1,
                        message:'分类添加成功',
                        data:{}
                    })
                }).catch(function (err) {
                    res.json({
                        state:0,
                        message:'保存数据错误',
                        data:{}
                    })
                })
            }
        }).catch(function (err) {
            console.log(err)
            res.json({
                state:0,
                message:'读取分类数据错误',
                data:{}
            })
        });
    }
};
//删除分类
exports.deleteGenre = function(req,res,next){
    let id = req.params.tid;
    genreOperator.deleteGenreById(id).then(function () {
        res.json({
            state:1,
            message:'删除成功',
            data:{}
        })
    }).catch(function (err) {
        res.json({
            state:0,
            message:err,
            data:{}
        })
    })
};
//修改分类
exports.modifyGenre = function(req,res,next){
    let method = req.method.toLowerCase();
    if (method === 'get'){
        let pageData = {};
        let genreId = req.params.tid;
        let queryGenre = genreOperator.getGenreById(genreId);
        Promise.all([queryGenre]).then(function ([genre]) {
            pageData.genre = genre;
            pageData.pageTitle = '修改分类';
            pageData.pageSign = 'genrePage';
            res.render('admin/modifyGenre',pageData);
        }).catch(function (err) {
            next()
        });

    }
    if(method === 'post'){
        let id = req.body.id;
        let opt = {
            title:req.body.title,
            genreName:req.body.genreName,
            isNav:req.body.isNav,
            icon:req.body.icon,
            sort:req.body.sort
        };
        // 验证
        let reg = /^[a-zA-Z]+$/;
        let dreg = /^(0|[1-9][0-9]*)$/g;
        let editError = '';
        if (opt.title === '') {
            editError = '分类名称不能是空的。';
        }else if (opt.isNav === undefined || opt.isNav === '') {
            editError = '是否在导航显示不可为空';
        } else if (opt.genreName === '') {
            editError = '分类路径不可为空';
        } else if (opt.icon === '') {
            editError = '分类图标不可为空';
        }else if(!reg.test(opt.genreName)){
            editError = '路径只能用英文字母'
        }else if(!dreg.test(opt.sort)){
            editError = '排序只能为数字'
        }
        if (editError !== '') {
            res.json({
                state:0,
                message:editError,
                data:{}
            })
        }
        let queryGenres = genreOperator.getGenreByQuery({});
        queryGenres.then(function (genres) {
            let addError = false;
            for(let i=0; i<genres.length;i++){
                if(genres[i]._id.toString() === id){
                    continue
                }
                if(genres[i].title === opt.title || genres[i].genreName === opt.genreName){
                    addError = true;
                    break
                }
            }
            if(addError){
                res.json({
                    state:0,
                    message:'分类名称或路径己被占用',
                    data:{}
                })
            }else{
                genreOperator.genreUpdate(id,opt).then(function (genre) {
                    res.json({
                        state:1,
                        message:'分类修改成功',
                        data:{}
                    })
                }).catch(function (err) {
                    res.json({
                        state:0,
                        message:err,
                        data:{}
                    })
                })
            }
        }).catch(function (err) {
            res.json({
                state:0,
                message:err,
                data:{}
            })
        });
    }
};
//ajax请求文章分类
exports.genreList = function(req,res){
    let queryGenre = genreOperator.getGenreByQuery({});
    queryGenre.then(function (result){
        res.json({
            state:1,
            message:'success',
            data:result
        })
    }).catch(function (err) {
        res.json({
            state:1,
            message:err,
            data:{}
        })
    })
};


//连接管理列表
exports.link = function(req,res,next){
    let pageData = {};
    let queryLinks = linkOperator.getLinkByQuery({});
    Promise.all([queryLinks]).then(function ([links]) {
        pageData.pageTitle = '连接管理';
        pageData.pageSign = 'linkPage';
        pageData.links = links;
        res.render('admin/link',pageData);
    }).catch(function (err) {
        next(err)
    });
};
//添加连接
exports.addLink = function(req,res,next){
    let method = req.method.toLowerCase();
    if (method === 'get'){
        let pageData = {};
        pageData.pageTitle = '添加连接';
        pageData.pageSign = 'linkPage';
        res.render('admin/addLink',pageData);
    }
    if(method === 'post'){
        let opt = {
            title:req.body.title,
            url:req.body.url,
            icon:req.body.icon
        };
        // 验证
        let editError = '';
        if (opt.title === '') {
            editError = '连接名称不能是空的。';
        } else if (opt.url === '') {
            editError = '连接路径不可为空';
        } else if (opt.icon === '') {
            editError = '连接图片不可为空';
        }
        if (editError !== '') {
            res.json({
                state:0,
                message:editError,
                data:{}
            })
        }
        let queryLinks = linkOperator.getLinkByQuery({});
        queryLinks.then(function (links) {
            let addError = false;
            for(let i=0; i<links.length;i++){
                if(links[i].title === opt.title){
                    addError = true;
                    break
                }
            }
            if(addError){
                res.json({
                    state:0,
                    message:'连接名称己被占用',
                    data:{}
                })
            }else{
                linkOperator.addNewLink(opt).then(function () {
                    res.json({
                        state:1,
                        message:'连接添加成功',
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
        }).catch(function (err) {
            res.json({
                state:0,
                message:'读取连接数据错误',
                data:{}
            })
        });
    }
};
//删除连接
exports.deleteLink = function(req,res,next){
    let id = req.params.tid;
    linkOperator.deleteLinkById(id).then(function () {
        res.json({
            state:1,
            message:'删除成功',
            data:{}
        })
    }).catch(function (err) {
        res.json({
            state:0,
            message:err,
            data:{}
        })
    })
};
//修改连接
exports.modifyLink = function(req,res,next){
    let method = req.method.toLowerCase();
    if (method === 'get'){
        let pageData = {};
        let linkId = req.params.tid;
        let queryLink = linkOperator.getLinkById(linkId);
        Promise.all([queryLink]).then(function ([link]) {
            pageData.link = link;
            pageData.pageTitle = '修改连接';
            pageData.pageSign = 'linkPage';
            res.render('admin/modifyLink',pageData);
        }).catch(function (err) {
            next(err)
        });
    }
    if(method === 'post'){
        let id = req.body.id;
        let opt = {
            title:req.body.title,
            url:req.body.url,
            icon:req.body.icon
        };
        // 验证
        let editError = '';
        if (opt.title === '') {
            editError = '连接名称不能是空的。';
        } else if (opt.url === '') {
            editError = '连接地址不可为空';
        } else if (opt.icon === '') {
            editError = '连接图片不可为空';
        }
        if (editError !== '') {
            res.json({
                state:0,
                message:editError,
                data:{}
            })
        }
        let queryLinks = linkOperator.getLinkByQuery({});
        queryLinks.then(function (links) {
            let addError = false;
            for(let i=0; i<links.length;i++){
                if(links[i]._id.toString() === id){
                    continue
                }
                if(links[i].title === opt.title){
                    addError = true;
                    break
                }
            }
            if(addError){
                res.json({
                    state:0,
                    message:'连接名称或路径己被占用',
                    data:{}
                })
            }else{
                linkOperator.linkUpdate(id,opt).then(function (genre) {
                    res.json({
                        state:1,
                        message:'连接修改成功',
                        data:{}
                    })
                }).catch(function (err) {
                    res.json({
                        state:0,
                        message:err,
                        data:{}
                    })
                })
            }
        }).catch(function (err) {
            res.json({
                state:0,
                message:err,
                data:{}
            })
        });
    }
};

//留言管理列表
exports.message = function (req,res,next) {
    let pageData = {};
    let queryMessages = messageOperator.getMessageByQuery({});
    Promise.all([queryMessages]).then(function ([messages]) {
        pageData.pageTitle = '留言管理';
        pageData.pageSign = 'messagePage';
        pageData.messages = messages;
        res.render('admin/message',pageData);
    }).catch(function (err) {
        next(err)
    });
};
//删除留言
exports.deleteMessage = function (req,res,next) {
    let id = req.params.tid;
    messageOperator.deleteMessageById(id).then(function () {
        res.json({
            state:1,
            message:'删除成功',
            data:{}
        })
    }).catch(function (err) {
        res.json({
            state:0,
            message:err,
            data:{}
        })
    })
};


//回复留言
exports.modifyMessage = function(req,res,next){
    let method = req.method.toLowerCase();
    if (method === 'get'){
        let pageData = {};
        let messageId = req.params.tid;
        let queryMessage = messageOperator.getMessageById(messageId);
        Promise.all([queryMessage]).then(function ([message]) {
            pageData.message = message;
            pageData.pageTitle = '回复留言';
            pageData.pageSign = 'messagePage';
            res.render('admin/modifyMessage',pageData);
        }).catch(function (err) {
            next(err)
        });
    }
    if(method === 'post'){
        let id = req.body.id;
        let opt = {
            reply:req.body.reply,
        };
        messageOperator.messageUpdate(id,opt).then(function (message) {
            res.json({
                state:1,
                message:'回复成功',
                data:{}
            })
        }).catch(function (err) {
            res.json({
                state:0,
                message:err,
                data:{}
            })
        })
    }
};
