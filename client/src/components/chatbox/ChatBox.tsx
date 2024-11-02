import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, ChevronLeft } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useChat } from "../../hooks/useChat";

const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages, isLoading, sendMessage } = useChat();

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    localStorage.removeItem("aiThreadId");
    setMessages([]);
    return () => {
      localStorage.removeItem("aiThreadId");
    };
  }, [setMessages]);

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 bg-[#4A43EC] text-white rounded-full p-4 shadow-lg hover:bg-[#3f39c8] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:bg-[#1a0fe9] focus:ring-opacity-50"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white text-gray-800 rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col h-[32rem] transition-all duration-300 ease-in-out animate-in slide-in-from-bottom-2">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <button
            onClick={toggleChat}
            className="text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200"
            aria-label="Close chat"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-semibold">EBot</h2>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 shadow-md flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default React.memo(ChatBox);
