import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLogins } from "./firebase.utils";

import "./App.css";

function Login() {
  const navigate = useNavigate();
  const register = () => navigate("/register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (email.length > 0 && password.length > 0) {
      await getAdminSettings();
    } else if (email.length > 0 && password.length === 0) {
      setMessage("Password cannot be blank");
    } else if (email.length === 0 && password.length > 0) {
      setMessage("Email cannot be blank");
    } else {
      setMessage("Invalid Email and/or Password");
    }
  };

  const getAdminSettings = async () => {
    try {
      const response = await getLogins();
      if (response) {
        response.forEach((login) => {
          if (email === login.email && password === login.password)
            navigate("/loggedin");
          else setMessage("Login failed!");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <div className="login-box">
        <h2>Log In</h2>
        <div className="flex">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="flex">
          <div>
            <button onClick={register}> Register</button>
            <button type="submit" onClick={submit}>
              {" "}
              Log In
            </button>
          </div>
          <span
            id="message"
            dangerouslySetInnerHTML={{ __html: message }}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
