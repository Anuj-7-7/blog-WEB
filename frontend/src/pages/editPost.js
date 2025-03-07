import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost({ title: data.title, content: data.content });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/posts/${id}`, post);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header">
          <h2 className="mb-0">Edit Post</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
                className="form-control"
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={post.content}
                onChange={handleChange}
                placeholder="Edit your content here..."
                required
                className="form-control"
                style={{ minHeight: "200px" }}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-lg w-100">
              Update Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
