const express = require('express');
const article = require('./controller/article');
const router = express.Router();

//首页
router.get('/',article.index);
router.get('/message',article.message);
router.post('/message',article.message);
router.get('/links',article.link);
router.get('/sentences',article.sentences);
router.get('/senlist',article.senlist);
router.get('/article',article.list);
router.get('/article/:tid',article.details);



module.exports = router;