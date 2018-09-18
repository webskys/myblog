const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    name: String,
    email: String,
    comment:String,
    reply: String,
    create_at: Date,
    reply_at: Date
});

messageSchema.pre('save', function() {
    if (this.isNew) {
        this.create_at = Date.now();
    } else {
        this.update_at = Date.now();
    }
});
messageSchema.pre('update', function() {
    this.update({},{ $set: { reply_at: new Date() } });
});

module.exports = messageSchema;