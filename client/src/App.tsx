import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import Events from "./pages/Events";
import SingleEventPage from "./pages/SingleEventPage";
import LandingPage from "./pages/LandingPage";
import EventMapPage from "./pages/EventMapPage";
import CreateEventPage from "./pages/CreateEventPage";
import NewPassword from "./pages/NewPassword";

import ChatBox from "./components/chatbox/ChatBox";

import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./components/contextAPI/ThemeContext";

function App() {
  const { theme } = useTheme();
  return (
    <div>
      <Navbar />
      <Routes>
        <Route>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<SingleEventPage />} />
          <Route path="/map" element={<EventMapPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-password/:token" element={<NewPassword />} />
        </Route>
      </Routes>
      <ChatBox />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme={theme === "dark" ? "dark" : "light"}
        transition={Slide}
      />
    </div>
  );
}

export default App;
