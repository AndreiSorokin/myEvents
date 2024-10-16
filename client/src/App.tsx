import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import Events from "./pages/Events";
import NewPassword from "./pages/NewPassword";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-password/:token" element={<NewPassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
