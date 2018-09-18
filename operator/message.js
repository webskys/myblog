const models = require('../models/index');
const messageModel = models.messageModel;

exports.addNewMessage = function(opt){
    return messageModel.create(opt)
};
exports.getMessageByQuery = function (query) {
    return messageModel.find(query, {}).exec();
};
exports.deleteMessageById = function(id){
    return messageModel.deleteOne({_id: id});
};
exports.getMessageById = function (id) {
    return messageModel.findOne({_id: id}).exec();
};
exports.messageUpdate= function(id,opt) {
    return messageModel.update({_id: id}, opt).exec()
};