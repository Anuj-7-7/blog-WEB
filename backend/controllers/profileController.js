import User from "../models/User.js"; // Adjust based on your DB

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");  // Adjust based on your DB
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
