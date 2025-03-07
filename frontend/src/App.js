import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Only import Routes and Route
import Home from "./pages/home.js";
import Login from "./pages/login.js";
import Register from "./pages/register.js";
import Navbar from "./components/navbar.js";
import PostForm from "./pages/PostForm.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import PostDetails from "./pages/PostDetails";
import Profile from "./pages/profile.js";
import EditPost from "./pages/editPost.js";

const App = () => {
  const [user, setUser] = useState(null);
  
  return (   
    <>
    <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/new" element={<PostForm />} />
        <Route path="/post/edit/:id" element={<PostForm />} />
        <Route path="/post/:id" element={<PostDetails user={user} />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
      </Routes>
    </>
  );
};

export default App;
