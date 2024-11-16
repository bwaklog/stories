import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Profile from "./pages/Profile"
import ViewStory from "./pages/ViewStory";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/story" element={<Story />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/viewStory" element={<ViewStory />} />
      </Routes>
    </Router>
  );
}

export default App;