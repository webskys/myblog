const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sentenceSchema = new Schema({
    content: { type: String },
    create_at: { type: Date, default: Date.now }
});

sentenceSchema.pre('save', function(next) {
    if (this.isNew) {
        this.create_at = Date.now();
    }
    next();
});

module.exports = sentenceSchema;