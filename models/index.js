const mongoose = require('mongoose');
const cfg = require('../config');
const articleSchema = require('./article');
const genreSchema = require('./genre');
const adminSchema = require('./admin');
const linkSchema = require('./link');
const messageSchema = require('./message');


mongoose.connect(cfg.mongodb,{useNewUrlParser:true});
let db = mongoose.connection;
db.on('error',console.error.bind(console,cfg.dbInfo.error));
db.once('open',function () {
    console.log(cfg.dbInfo.success)
});

exports.articleModel = mongoose.model('article',articleSchema);
exports.genreModel = mongoose.model('genre',genreSchema);
exports.adminModel = mongoose.model('admin',adminSchema);
exports.linkModel = mongoose.model('link',linkSchema);
exports.messageModel = mongoose.model('message',messageSchema);
