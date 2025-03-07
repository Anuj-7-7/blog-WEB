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
  origin: "https://blog-web-neon-zeta.vercel.app", // Update in production
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect to DB before starting server
await connectDB();

// **Remove @vercel/node and use traditional Express**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; // This helps in case Vercel needs it
