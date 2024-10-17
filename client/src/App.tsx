import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import Events from "./pages/Events";
import SingleEventPage from "./pages/SingleEventPage";
import LandingPage from "./pages/LandingPage";
import EventMapPage  from "./pages/EventMapPage";
import NewPassword from "./pages/NewPassword";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/events" element={<Events />}/>
          <Route path="/events/:id" element={<SingleEventPage/>}/>
          <Route path="/map" element={<EventMapPage />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/new-password/:token" element={<NewPassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
