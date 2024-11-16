import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

export default function RouteProtection({ children }) {
    const token = localStorage.getItem("jwt");
  
    if (!isAuthenticated()) {
        alert("You need to be logged in to access this page!");
      return <Navigate to="/" replace />;
    }

    return children;
  }