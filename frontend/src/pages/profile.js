import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) {
      console.warn("No valid user session, redirecting...");
      navigate("/login");
      return;
    }

    console.log("Fetching posts for user:", user);  // Debugging user
    console.log("Token used:", token);  // Debugging token

    API.get("/posts/my-posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("Posts fetched:", res.data); // Debugging API response
        setPosts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err.response?.data || err.message);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [user, navigate, token]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
    }
  };

  if (loading) return <p>Loading your posts...</p>;
  if (!user) return null;

  return (
    <div className="container mt-5">
      <h1>Your Profile</h1>
      <p>Welcome, <strong>{user.name}</strong>!</p>
      <h2>Your Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found. Try creating a new one!</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="card p-3 mb-3">
            <h3>{post.title}</h3>
            {post.image && <img src={post.image} alt={post.title} style={{ width: "100%", height: "400px", objectFit: "cover" }} />}
            <p>{post.content}</p>
            <div>
              <button className="btn btn-primary me-2" onClick={() => navigate(`/edit-post/${post._id}`)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(post._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
      <button onClick={logout} className="btn btn-danger mb-3">Logout</button>
    </div>
  );
};

export default Profile;
