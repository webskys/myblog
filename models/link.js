const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    title: String,
    icon:String,
    url: String
});
module.exports = linkSchema;