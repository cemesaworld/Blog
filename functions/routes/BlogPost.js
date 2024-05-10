// Import necessary modules
const express = require('express');
const router = express.Router();
const BlogPost = require ('../models/BlogPost');
const BlogPost = require ('../schema/BlogPost');
const API_URI = 'https://cuteko.netlify.app/';


router.get('/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route for getting a specific blog post by ID
router.get('/posts/:id', getBlogPost, (req, res) => {
  res.json(res.blogPost);
});

// Route for creating a new blog post
router.post('/posts', async (req, res) => {
  const post = new BlogPost({
    title: req.body.title,
    content: req.body.content,
    categories: req.body.categories
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route for updating a blog post by ID
router.patch('/posts/:id', getBlogPost, async (req, res) => {
  if (req.body.title != null) {
    res.blogPost.title = req.body.title;
  }
  if (req.body.content != null) {
    res.blogPost.content = req.body.content;
  }
  if (req.body.categories != null) {
    res.blogPost.categories = req.body.categories;
  }

  try {
    const updatedPost = await res.blogPost.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route for deleting a blog post by ID
router.delete('/posts/:id', getBlogPost, async (req, res) => {
  try {
    await res.blogPost.remove();
    res.json({ message: 'Blog post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a specific blog post by ID
async function getBlogPost(req, res, next) {
  let blogPost;
  try {
    blogPost = await BlogPost.findById(req.params.id);
    if (blogPost == null) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.blogPost = blogPost;
  next();
}

module.exports = router;
