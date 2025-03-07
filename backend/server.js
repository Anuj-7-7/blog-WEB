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

// ✅ Fix: Configure CORS first
const allowedOrigins = [
  "https://blog-web-neon-zeta.vercel.app", // Production
  "http://localhost:3000", // Development
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // ✅ Allow all necessary methods
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Explicitly allow headers
};

app.use(cors(corsOptions));
app.options("*", cors()); // ✅ Handle preflight requests

// ✅ Fix: Use `express.json()` after CORS
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Fix: Proper async DB connection
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

export default app;
