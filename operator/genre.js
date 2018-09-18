const models = require('../models/index');
const genreModel = models.genreModel;


exports.addNewGenre = function(opt,cb){
    return genreModel.create(opt)
};
exports.getGenreByQuery = function (query) {
    return genreModel.find(query, {}).exec();
};

exports.deleteGenreById = function(id){
    return genreModel.deleteOne({_id: id});
};
exports.getGenreById = function (id) {
    return genreModel.findOne({_id: id}).exec();
};
exports.genreUpdate= function(id,opt) {
    return genreModel.update({_id: id}, opt).exec();
};