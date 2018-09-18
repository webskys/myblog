const models = require('../models/index');
const linkModel = models.linkModel;


exports.addNewLink = function(opt){
    return linkModel.create(opt)
};
exports.getLinkByQuery = function (query) {
    return linkModel.find(query, {}).exec();
};

exports.deleteLinkById = function(id){
    return linkModel.deleteOne({_id: id});
};
exports.getLinkById = function (id) {
    return linkModel.findOne({_id: id}).exec();
};
exports.linkUpdate= function(id,opt) {
    return linkModel.update({_id: id}, opt).exec()
};