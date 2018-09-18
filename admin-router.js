const express = require('express');
const check = require('./controller/checkLogin');
const admin = require('./controller/admin');
const upload = require('./multerUtil');


const router = express.Router();
//登录页
router.get('/login' , check.checkNotLogin , admin.showLogin);
//登录请求
router.post('/login' , check.checkNotLogin , admin.login);
//退出登录
router.post('/logout' , check.checkLogin , admin.loginOut);
//后台首页
router.get('/' , check.checkLogin , admin.index);

//管理员
router.get('/manager' , check.checkLogin , admin.manager);
//添加管理员
router.post('/manager/add' , check.checkLogin , admin.addManager);
//删除管理员
router.post('/manager/remove/:tid' , check.checkLogin , admin.removeManager);
//修改管理员
router.get('/manager/modify/:tid' , check.checkLogin , admin.modifyManager);
router.post('/manager/modify/:tid' , check.checkLogin , admin.modifyManager);

//文章
router.get('/article' , check.checkLogin , admin.article);
//ajax获取列表文章
router.post('/article' , check.checkLogin , admin.articleList);
//修改文章
router.get('/article/edit/:tid' , check.checkLogin , admin.modifyArticle);
router.post('/article/edit/:tid' , check.checkLogin , admin.modifyArticle);
//添加文章
router.get('/article/add' , check.checkLogin , admin.addArticle);
router.post('/article/add' , check.checkLogin , admin.addArticle);
//删除文章
router.post('/article/delete/:tid' , check.checkLogin , admin.deleteArticle);

//上传图片
router.post('/upload' , check.checkLogin,upload.single('editormd-image-file'), admin.uploadFile);

//文章分类
router.get('/genre' , check.checkLogin , admin.genre);
router.post('/genre' , check.checkLogin , admin.genreList);
//删除分类
router.post('/genre/delete/:tid' , check.checkLogin , admin.deleteGenre);
//修改分类
router.get('/genre/edit/:tid' , check.checkLogin , admin.modifyGenre);
router.post('/genre/edit/:tid' , check.checkLogin , admin.modifyGenre);
//添加分类
router.get('/genre/add' , check.checkLogin , admin.addGenre);
router.post('/genre/add' , check.checkLogin , admin.addGenre);

//连接列表
router.get('/link' , check.checkLogin , admin.link);
//删除连接
router.post('/link/delete/:tid' , check.checkLogin , admin.deleteLink);
//修改连接
router.get('/link/edit/:tid' , check.checkLogin , admin.modifyLink);
router.post('/link/edit/:tid' , check.checkLogin , admin.modifyLink);
//添加连接
router.get('/link/add' , check.checkLogin , admin.addLink);
router.post('/link/add' , check.checkLogin , admin.addLink);

//留言列表
router.get('/message' , check.checkLogin , admin.message);
//删除留言
router.post('/message/delete/:tid' , check.checkLogin , admin.deleteMessage);
//修改留言
router.get('/message/edit/:tid' , check.checkLogin , admin.modifyMessage);
router.post('/message/edit/:tid' , check.checkLogin , admin.modifyMessage);




module.exports = router;