import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useRequestPasswordResetMutation } from "../../api/authSlice";
import { useTheme } from "../contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestForgotPasswordModal = ({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        setEmail("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Handle click outside modal content
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
        setEmail("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset({ email }).unwrap();
      onClose();
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 p-2 ${bgColor} ${fontColor}`}>
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Reset Password
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              htmlFor="reset-email"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="mr-3 bg-gray-300 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 px-4 py-2 text-white rounded hover:bg-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root")!);
};

export default RequestForgotPasswordModal;
