// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get('/posts');
        // Sort posts by creation date descending (newest first)
        const sortedPosts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);
  
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Recent Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found. Be the first to create one!</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-md-4 mb-4">
              <div className="card h-100">
                {post.image ? (
                  <img
                    src={post.image}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      height: '200px',
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#666'
                    }}
                  >
                    No Image Available
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  {/* Title */}
                  <h5 className="card-title">{post.title || "Untitled Post"}</h5>
                  {/* Author */}
                  <p className="text-muted mb-1">
                  by {post.author?.name || "Unknown Author"}
                  </p>
                  {/* Content */}
                  <p className="card-text flex-grow-1">
                    {post.content.length > 150
                      ? `${post.content.substring(0, post.content.lastIndexOf(' ', 150))}...`
                      : post.content}
                  </p>
                  
                  {/* Read More Button */}
                  <Link to={`/post/${post._id}`} className="btn btn-primary mt-3">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
