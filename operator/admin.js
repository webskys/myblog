const models = require('../models/index');
const adminModel = models.adminModel;


/*const sha1 = require('sha1');
let superAdmin = new adminModel({
    name: 'admin',
    password: sha1('lh526410'),
    superAdmin:true
});
superAdmin.save().then(function(product) {
console.log(product)
});*/


exports.checkUser = function (name) {
    return adminModel.findOne({name: name}).exec();
};




