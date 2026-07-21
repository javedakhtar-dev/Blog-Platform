const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    blog: {type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    comment: {type: String, minlength: 3, trim: true, required: true}
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;