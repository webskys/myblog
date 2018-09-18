const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: { type: 'string', required: true },
    password: { type: 'string', required: true },
    superAdmin:Boolean
});
module.exports = adminSchema;
