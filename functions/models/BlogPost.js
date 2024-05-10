const mongoose = require('mongoose');
const blogPostSchema = require('../schema/BlogPost');
const BlogPost = require('../schema/BlogPost');

const BlogPostModel = mongoose.model('Blog', BlogPost);

module.exports = BlogPostModel;