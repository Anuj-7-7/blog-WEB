import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import profileRoutes from "./routes/profileRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // Only allow this origin
  credentials: true,               // Allow credentials (cookies, authorization headers, TLS client certificates)
};
app.use(cors(corsOptions));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect to DB first, then start server
connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});
