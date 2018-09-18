const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


let ArticleSchema = new Schema({
    title: { type: String },
    brief: {type:String},
    icon: String,
    content: { type: String },
    genre:{
        type: ObjectId,
        ref: 'genre'
    },
    reply_count: { type: Number, default: 0 },
    visit_count: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },

});
ArticleSchema.pre('save', function(next) {
    if (this.isNew) {
        this.create_at = Date.now();
        this.update_at = Date.now();
    } else {
        this.update_at = Date.now();
    }
    next();
});

module.exports = ArticleSchema;

