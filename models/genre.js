const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
    title: String,
    genreName: String,
    isNav: {
        type: Boolean,
        default: false
    },
    sort: {
        type: Number,
        default:0
    },
    icon: String
});
module.exports = genreSchema;