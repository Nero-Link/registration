import { Route, Routes } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import LoggedIn from "./LoggedIn";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loggedin" element={<LoggedIn />} />
      </Routes>
    </>
  );
}

export default App;
