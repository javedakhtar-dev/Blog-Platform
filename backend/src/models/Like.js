const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    blog: {type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

const Like = mongoose.model('likes', LikeSchema);

module.exports = Like;