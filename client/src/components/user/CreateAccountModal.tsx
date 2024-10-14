import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import CreateUser from "./CreateUser";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAccountModal = ({
  isOpen,
  onClose,
}: CreateAccountModalProps) => {
  const [role, setRole] = useState<"user" | "organizer" | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        setRole(null);
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
        setRole(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  // Modal content
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {role ? (
          // Show form after selecting a role
          <CreateUser role={role} onClose={onClose} />
        ) : (
          // Role selection view with buttons
          <>
            <h2
              id="modal-title"
              className="text-xl font-semibold text-center mb-4"
            >
              Select Your Role
            </h2>
            <div className="flex justify-around">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition"
                onClick={() => setRole("user")}
              >
                User
              </button>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition"
                onClick={() => setRole("organizer")}
              >
                Organizer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root")!);
};

export default CreateAccountModal;
