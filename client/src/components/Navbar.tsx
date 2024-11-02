import { useNavigate, Link } from "react-router-dom";
import { useLogoutMutation } from "../api/authSlice";
import { useTheme } from "./contextAPI/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import { getThemeStyles } from "@/utils/themeUtils";
import { toast } from "react-toastify";
import { CustomError } from "@/misc/error";
import logo from "../img/logo.png";

const Navbar = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.info("You have been logged out");
      // Redirect to login page after logout
      navigate("/login");
    } catch (error) {
      const err = error as CustomError;
      toast.error(
        "Error during log out, please try again later! Error: " +
          (err.data?.message || err.message || "Unknown error")
      );
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div>
      <nav className={`${bgColor} ${fontColor}`}>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img className="h-8 w-auto" src={logo} alt="Your Company" />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Home
                  </Link>
                  <Link
                    to="/events"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Events
                  </Link>
                  <Link
                    to="/map"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Map
                  </Link>
                  <Link
                    to="/create-event"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Create Event
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                onClick={toggleTheme}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
