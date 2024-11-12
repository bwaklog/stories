import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onButtonClick = () => {
    setEmailError("");
    setUsernameError("");
    setPasswordError("");

    if (email === "") {
      setEmailError("Please enter your email");
      return;
    }
    if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }
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
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Register</div>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="inputBox"
        />
        <label className="errorLabel">{emailError}</label>
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
      <div className="inputContainer" style={{ position: "relative" }}>
        <input
          type={passwordVisible ? "text" : "password"}
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="inputBox"
        />
        <label className="errorLabel">{passwordError}</label>
        <div
          className="eyeIcon"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
        </div>
      </div>
      <br />
      <div className="inputContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClick}
          value="Register"
        />
      </div>
    </div>
  );
};

export default Register;