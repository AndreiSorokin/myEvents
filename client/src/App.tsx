import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordForm />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
