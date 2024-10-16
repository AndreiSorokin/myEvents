import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import Events from "./pages/Events";
import SingleEventPage from "./pages/SingleEventPage";
import LandingPage from "./pages/LandingPage";
import Map from "./pages/Map";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/events" element={<Events />}/>
          <Route path="/events/:id" element={<SingleEventPage/>}/>
          <Route path="/map" element={<Map/>}/>
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
