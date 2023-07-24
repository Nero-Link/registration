import { useNavigate } from "react-router-dom";

import "./App.css";

function LoggedIn() {
  const navigate = useNavigate();
  const home = () => navigate("/");
  return (
    <div className="App">
      <h2>You Have Logged In Successfully!</h2>
      <button type="submit" onClick={home}>
        {" "}
        Back
      </button>
    </div>
  );
}

export default LoggedIn;
