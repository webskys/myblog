const models = require('../models/index');
const sentenceModel = models.sentenceModel;


exports.addNewSentence = function(opt,cb){
    return sentenceModel.create(opt)
};
exports.getSentenceByQuery = function (query) {
    return sentenceModel.find(query, {}).exec();
};

exports.getSentenceByQuery = function (query, opt) {
    return sentenceModel.find(query, {'content':1,'create_at':1}, opt).exec();
};
exports.getCountByQuery = function (query) {
    return sentenceModel.countDocuments(query).exec();
};
exports.deleteSentenceById = function(id){
    return sentenceModel.deleteOne({_id: id});
};
exports.getSentenceById = function (id) {
    return sentenceModel.findOne({_id: id}).exec();
};
exports.sentenceUpdate= function(id,opt) {
    return sentenceModel.update({_id: id}, opt).exec();
};

