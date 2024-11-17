import React from "react";
import { useNavigate } from "react-router-dom";
import "../Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="landing-container">
      <div className="buttons">
        <button className="login-btn" onClick={handleLoginClick}>
          Login
        </button>
        <button className="register-btn" onClick={handleRegisterClick}>
          Register
        </button>
      </div>
      <div className="content">
        <h1>STORIES</h1>
        <p>
          Collaborate, share and
          <br />
          build story sharing
          <br />
          communities <span className="cursor-icon">➤</span>
        </p>
      </div>
    </div>
  );
};

export default Landing;