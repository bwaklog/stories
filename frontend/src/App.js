import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Profile from "./pages/Profile"
import ViewStory from "./pages/ViewStory";
import Search from "./pages/Search";
import RouteProtection from "./RouteProtection";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} /> 
      <Route path="/home" element={<RouteProtection><Home /></RouteProtection>} /> 
      <Route path="/story" element={<RouteProtection><Story /></RouteProtection>} /> 
      <Route path="/profile" element={<RouteProtection><Profile /></RouteProtection>} /> 
      <Route path="/viewStory/:storyId" element={<RouteProtection><ViewStory /></RouteProtection>} />
      <Route path="/search" element={<RouteProtection><Search /></RouteProtection>} />
      </Routes>
    </Router>
  );
}

export default App;