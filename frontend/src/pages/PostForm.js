import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

const PostForm = () => {
  const { id } = useParams(); // For edit mode; undefined if creating
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // If editing, fetch existing post details
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const { data } = await API.get(`/posts/${id}`);
          setTitle(data.title);
          setContent(data.content);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
      fetchPost();
    }
  }, [id]);

  // Handle file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    console.log("Submitting post:", { title, content, imageFile });

    // Upload image if available
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        console.log("Uploading image...");
        const { data } = await API.post('/posts/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = data.imageUrl;
        console.log("Image uploaded:", imageUrl);
      } catch (error) {
        console.error('Image upload error:', error.response?.data || error.message);
        return; // Stop if image upload fails
      }
    }

    try {
      console.log("Saving post with data:", { title, content, image: imageUrl });
      const response = id
        ? await API.put(`/posts/${id}`, { title, content, image: imageUrl })
        : await API.post('/posts', { title, content, image: imageUrl });
      console.log("Post saved:", response.data);
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header">
          <h2 className="mb-0">{id ? 'Edit Post' : 'Create New Post'}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-control"
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea
                id="content"
                placeholder="Write your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="form-control"
                style={{ minHeight: '200px' }}
              ></textarea>
            </div>

            {/* File Input */}
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Upload Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-lg w-100">
              {id ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
