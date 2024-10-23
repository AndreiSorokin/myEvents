import { useState } from "react";
import { useLoginMutation } from "../../api/authSlice";
import { useNavigate } from "react-router-dom";
import { CreateAccountModal } from "../user/CreateAccountModal";
import RequestForgotPasswordModal from "./ForgotPasswordModal";
import { useTheme } from "../contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";
import { toast } from "react-toastify";
import { CustomError } from "@/misc/error";
import logo from "../../img/logo.png";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.info("Please fill in all fields");
        return;
      }
      await login({ email, password }).unwrap();
      toast.success("Login successful!");
      navigate("/events");
    } catch (error) {
      const err = error as CustomError;
      toast.error(
        "Login failed: " + (err.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <div
      className={`flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ${bgColor} ${fontColor}`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src={logo} className="mx-auto h-20 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      {/* Email */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => setIsForgotPasswordModalOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Google Login Button */}
        <div className="flex justify-center mt-6">
          <GoogleLoginButton />
        </div>

        {/* Create an account */}
        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            onClick={() => setIsCreateAccountModalOpen(true)}
          >
            Sign up
          </a>
        </p>
      </div>
      {/* Render ForgotPasswordModal */}
      <RequestForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
      />
    </div>
  );
};

export default Login;
