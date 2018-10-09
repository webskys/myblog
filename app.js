const path = require('path');
const http = require('http');
const express = require('express');
const cfg = require('./config');
const webRouter = require('./web-router');
const adminRouter = require('./admin-router');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
const favicon = require('express-favicon');
let checkMobile = require('./controller/checkMobile');


let app = express();
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));


app.use(cookieParser(cfg.session.secret));
app.use(session({
    name:cfg.session.name,
    secret: cfg.session.secret,
    cookie:{
        maxAge:cfg.session.maxAge
    },
    store:new MongoStore({
        url:cfg.mongodb
    }),
    rolling: true,
    resave:true,
    saveUninitialized: false
}));


app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'uploadfiles')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


app.use(function(req,res,next){
    let browser = checkMobile(req.headers['user-agent']);
    req.isMobile = browser.mobile || browser.ios || browser.android || browser.iPhone || browser.iPad;
    next();
});

app.use('/',webRouter);
app.use('/admin',adminRouter);





// 404 and error
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pc/error',{title:err.status,message:err.message});
});

let server = http.createServer(app);
server.listen(cfg.port,'127.0.0.1');
server.on('listening',function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('网站己启动，请访问： http://%s:%s',host,port)
});
