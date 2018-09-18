const models = require('../models/index');
const articleModel = models.articleModel;




exports.getArticleById = function (id) {
    return articleModel.findOne({_id: id}).populate('genre').exec();
};
exports.articleUpdate= function(id,opt) {
    return articleModel.update({_id: id}, opt).exec();
};
exports.addNewArticle = function(opt){
    return articleModel.create(opt);
};
exports.deleteArticleById = function(id){
    return articleModel.deleteOne({_id: id});
};



exports.addVisitor= function(id) {
    return articleModel.update({_id: id}, {$inc: {visit_count: 1}}).exec();
};
exports.prevData = function(id,cid){
    return  articleModel.findOne({ '_id': { '$lt': id },'genre' : cid }).sort({_id: -1}).limit(1).exec();
};
exports.nextData = function(id,cid){
    return  articleModel.findOne({ '_id': { '$gt': id },'genre' : cid  }).sort({_id: 1}).limit(1).exec();
};

exports.getArticleByQuery = function (query, opt) {
    return articleModel.find(query, {'reply_count':1,'visit_count':1,'icon':1,'title':1,'brief':1,'create_at':1,'update_at':1}, opt).exec();
};
exports.getCountByQuery = function (query) {
    return articleModel.countDocuments(query).exec();
};
exports.getArticleGenreCount = function () {
    return articleModel.aggregate().group({_id: '$genre' , count: {$sum: 1}}).exec();
};

exports.getLatest = function (query,count) {
    return articleModel.find(query, {'title':1}, {limit: count, sort: {create_at:-1}}).exec();
};