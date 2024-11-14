import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const onButtonClick = async () => {
    setUsernameError("");
    setPasswordError("");

    if (username === "") {
      setUsernameError("Please enter your username");
      return;
    }
    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      setUsernameError("Please enter a valid username");
      return;
    }
    if (password === "") {
      setPasswordError("Please enter your password");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be 8 characters or longer");
      return;
    }

    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("jwt", data.user.jwt);
      navigate("/home", { state: { username: data.user.username } });
    } else {
      setPasswordError(data.message || "Invalid username or password");
    }
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Login</div>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="inputBox"
        />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br />
      <div className="inputPasswordContainer" style={{ position: "relative" }}>
        <input
          type={passwordVisible ? "text" : "password"}
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="inputPasswordBox"
        />
        <label className="errorLabel">{passwordError}</label>
        <div
          className="eyeIcon"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
      <br />
      <div className="inputContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClick}
          value="Login"
        />
      </div>
      <div className="registerationContainer">
        <div>
          Don't have an account?{" "}
          <a className="registerLink" href="/register">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;