const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: { type: String, required: true },
    userName:{ type: String, required: true}
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = CommentSchema;