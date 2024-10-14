import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../api/authSlice";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      alert("Password reset successfully!");
      // Redirect to login after success
      navigate("/login");
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
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

          {error && (
            <p className="text-red-500 text-sm">Error resetting password</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
