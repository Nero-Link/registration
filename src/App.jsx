import { Route, Routes } from "react-router-dom";

import Calendar from "./Calendar";
import Admin from "./Admin";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Calendar />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
