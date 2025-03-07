import express from "express";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  getPostById,
  getMyPosts,
} from "../controllers/postControllers.js";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/my-posts", protect, getMyPosts);  // Protected route
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/upload", upload.single("image"), uploadImage);

export default router;
