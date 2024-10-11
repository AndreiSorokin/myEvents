import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
