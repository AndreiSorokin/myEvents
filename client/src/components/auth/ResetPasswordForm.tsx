import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../api/authSlice";
import { useTheme } from "../contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";
import { toast } from "react-toastify";
import { CustomError } from "@/misc/error";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.info("Passwords do not match");
      return;
    }
    try {
      await resetPassword({ token, newPassword }).unwrap();
      navigate("/login");
      toast.success("Password reset successful");
    } catch (error) {
      const err = error as CustomError;
      toast.error(
        "Password reset failed: " +
          (err.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 ${bgColor} ${fontColor}`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Reset Password
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 px-4 py-2 text-white rounded hover:bg-indigo-500"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
