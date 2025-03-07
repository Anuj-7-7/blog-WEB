import Post from "../models/Post.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name");
; // Fetch from DB, not API
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new post (assumes protect middleware sets req.user)
export const createPost = async (req, res) => {
  try {
    // req.user should be set by your auth middleware
    const { title, content, image } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "No user logged in" });
    }
    const post = await Post.create({
      title,
      content,
      image: image || "", // Use empty string if no image provided
      author: req.user._id,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post by ID
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPost) return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload an image for a post
export const uploadImage = async (req, res) => {
  try {
    // req.file.path provided by multer
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_images",
    });
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in user's posts
export const getMyPosts = async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ message: "No valid user session" });
      }

      const posts = await Post.find({ author: req.user._id });


      res.json(posts);
  } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Server error" });
  }
};
