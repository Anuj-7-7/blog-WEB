import express from "express";
import { registerUser, loginUser,getAllUsers} from "../controllers/userControllers.js";

const router=express.Router();
router.get("/",getAllUsers);
router.post("/register",registerUser);
router.post("/login",loginUser);

export default router;