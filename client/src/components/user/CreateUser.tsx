import { useCreateUserMutation } from "@/api/userSlice";
import { useState } from "react";
import { ConfettiButton } from "../ui/confetti";

interface CreateUserProps {
  role: "user" | "organizer";
  onClose: () => void;
}

const CreateUser = ({ role, onClose }: CreateUserProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUser, { isLoading, error }] = useCreateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ name, email, password, role }).unwrap();
      alert("User created successfully!");
      onClose();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">
        Create {role === "user" ? "User" : "Organizer"} Account
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <ConfettiButton
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
        >
          {isLoading ? "Creating..." : "Create Account"}
        </ConfettiButton>
      </div>

      {error && (
        <p className="text-red-500 text-sm">Error: {JSON.stringify(error)}</p>
      )}
    </form>
  );
};

export default CreateUser;
