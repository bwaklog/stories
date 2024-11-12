import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onButtonClick = () => {
    setUsernameError("");
    setPasswordError("");
    if (username === "") {
      setUsernameError("Please enter your username");
      return;
    }
    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      setUsernameError("Please enter valid username");
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

    // Authentication code needs to be added here
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div>Login</div>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br />
      <div className={"inputPasswordContainer"}>
        <input
          type={passwordVisible ? "text" : "password"}
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className={"inputPasswordBox"}
        />
        <div
          className="eyeIcon"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
        </div>
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={"Login"}
        />
      </div>
      <div className={"registerationContainer"}>
        <div>
          Don't have an account?{" "}
          <Link className={"registerLink"} to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;