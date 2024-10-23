import React, { useState, useCallback } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        onSendMessage(inputMessage);
        setInputMessage("");
      }
    },
    [inputMessage, isLoading, onSendMessage]
  );

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`bg-green-500 text-white rounded-r-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
        }`}
        disabled={isLoading}
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
};
