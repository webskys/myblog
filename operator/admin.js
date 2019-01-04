const models = require('../models/index');
const adminModel = models.adminModel;


exports.checkUser = function (name) {
    return adminModel.findOne({name: name}).exec();
};
