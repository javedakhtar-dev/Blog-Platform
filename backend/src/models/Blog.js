const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 3, maxlength: 150, trim: true },
    slug: {type: String, unique: true, trim: true, required: true, lowercase: true},
    content: {type: String, required: true, minlength: 20},
    coverImage: {type: String, default: ''},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    category: {type: String, required: true, trim: true},
    tags: [{type: String, trim: true}],
    views: {type: Number, default: 0, min: 0},
    likes: {type: Number, default: 0, min: 0},
    commentsCount: {type: Number, default: 0, min: 0},
    isPublished: {type: Boolean, default: false},
    publishedAt: {type: Date, default: null}
}, {
    timestamps: true
})

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;