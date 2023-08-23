const mongoose = require('mongoose');
const CommentSchema = require('./comment')
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    userName:{ type: String, required: true}, 
    title: { type: String, required: true },
    content: { type: String, required: true },
    upVote: [{type: String}],
    downVote: [{type: String}],
    comments: [CommentSchema]
    
});

const Thread = mongoose.model('thread', ThreadSchema)

module.exports = Thread;