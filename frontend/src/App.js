import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Profile from "./pages/Profile"
import ViewStory from "./pages/ViewStory";
import RouteProtection from "./RouteProtection";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} /> 
      <Route path="/register" element={<Register />} /> 
      <Route path="/home" element={<RouteProtection><Home /></RouteProtection>} /> 
      <Route path="/story" element={<RouteProtection><Story /></RouteProtection>} /> 
      <Route path="/profile" element={<RouteProtection><Profile /></RouteProtection>} /> 
      <Route path="/viewStory" element={<RouteProtection><ViewStory /></RouteProtection>} />
      </Routes>
    </Router>
  );
}

export default App;