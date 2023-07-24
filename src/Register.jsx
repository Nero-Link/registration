import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateLogins } from "./firebase.utils";

import "./App.css";

function Register() {
  const navigate = useNavigate();
  const home = () => navigate("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const REGISTER_DATA = [
    {
      email: email,
      password: password,
    },
  ];

  const submit = async () => {
    if (email.length > 0 && password.length > 0) {
      await updateLogins(REGISTER_DATA)
        .then(alert("Registered Successfully!"))
        .then(home());
    } else if (email.length > 0 && password.length === 0) {
      setMessage("Password cannot be blank");
    } else if (email.length === 0 && password.length > 0) {
      setMessage("Email cannot be blank");
    } else {
      setMessage("Invalid Email and/or Password");
    }
  };

  return (
    <div className="App">
      <div className="login-box">
        <h2>Register</h2>
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
            <button onClick={home}> Back</button>
            <button type="submit" onClick={submit}>
              {" "}
              Submit
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

export default Register;
