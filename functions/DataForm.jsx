// src/components/DataForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URI = 'https://cuteko.netlify.app/';

function DataForm() {
  const [formData, setFormData] = useState({ title: '', content: '', categories: '', commentText: '' });
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(".netlify/functions/getPosts");
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get("/.netlify/functions/getComments");
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/.netlify/functions/addPost", formData);
      fetchPosts(); // Fetch updated posts after adding a new one
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/.netlify/functions/addComment", {
        postId: formData.postId, // Add postId to identify the post to which the comment belongs
        text: formData.commentText
      });
      fetchComments(); // Fetch updated comments after adding a new one
      setFormData({ ...formData, commentText: '' }); // Reset comment text field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handlePostUpdate = async (postId, updatedData) => {
    try {
      await axios.put(`/api/posts/${postId}`, updatedData);
      fetchPosts(); // Fetch updated posts after updating
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      fetchPosts(); // Fetch updated posts after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h2>Add New Post</h2>
      <form onSubmit={handlePostSubmit}>
        {/* Form fields for adding posts */}
      </form>

      <h2>Add New Comment</h2>
      <form onSubmit={handleCommentSubmit}>
        <input type="text" name="commentText" placeholder="Add a comment" value={formData.commentText} onChange={(e) => setFormData({ ...formData, commentText: e.target.value })} />
        <button type="submit">Submit Comment</button>
      </form>

      <h2>Comments</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            {comment.text}
          </li>
        ))}
      </ul>

      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => handlePostUpdate(post.id, { title: "Updated Title", content: "Updated Content" })}>Update</button>
            <button onClick={() => handlePostDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataForm;
