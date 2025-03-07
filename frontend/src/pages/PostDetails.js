import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const PostDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await API.delete(`/posts/${id}`);
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (!post) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <div className="container mt-5">
      {/* Title */}
      <h1 className="fw-bold text-center">{post.title}</h1>

      {/* Image */}
      {post.image && (
        <div className="text-center my-4">
          <img
            src={post.image}
            alt={post.title}
            className="img-fluid rounded shadow-lg"
            style={{ maxHeight: "500px", width: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Post Content */}
      <div className="card shadow p-4">
        <p className="fs-5 text-dark">{post.content}</p>

        {/* Author Section */}
        <div className="mt-4 text-muted text-end">
          <strong>Posted by:</strong> {post.author?.name || "Unknown Author"}
        </div>
      </div>

      {/* Action Buttons (Edit/Delete) */}
      {user && user._id === post.author?._id && (
        <div className="mt-4 text-center">
          <button
            className="btn btn-warning me-3 px-4"
            onClick={() => navigate(`/edit/${id}`)}
          >
            ✏ Edit
          </button>
          <button className="btn btn-danger px-4" onClick={handleDelete}>
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
