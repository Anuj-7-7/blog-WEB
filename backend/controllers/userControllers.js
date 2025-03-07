import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"30d"});
};

export const registerUser=async (req,res) => {
    const {name,email,password}=req.body;
    try{
    const userExist=await User.findOne({email});
    if(userExist)return res.json({message:"user already exists."});

    const user=await User.create({ name,email,password});
    if(user)
        res.status(201).json({
         _id:user._id,
         name:user.name,
         email:user.email,
         token:generateToken(user._id),
    });
    else {
        res.status(400).json({ message: "Invalid user data" });
      }}
      catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }  
};

export const loginUser=async (req,res) => {
    const {email,password}=req.body;
    try {
        const user = await User.findOne({ email });
        if(user && (await user.matchPassword(password))){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
              });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
          }
    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message});
    }
};


export const getAllUsers=async (req,res) => {
    try {
        const users = await User.find(); // ✅ Fetch from DB, not API
        res.json(users);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server Error" });
    }
}