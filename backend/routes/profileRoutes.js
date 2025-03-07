import express from "express";
import { getProfile } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js"; // If you use authentication

const router = express.Router();

router.get("/", protect, getProfile);  // Define the endpoint

export default router;
