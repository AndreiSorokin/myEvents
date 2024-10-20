import React, { useState, useEffect, useCallback } from "react";
import { MessageCircle, ChevronLeft } from "lucide-react";
import {
  useAiChatMutation,
  useContinueAiChatMutation,
} from "../../api/eventsSlice";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const [aiChat, { isLoading: isAiChatLoading }] = useAiChatMutation();
  const [continueAiChat, { isLoading: isContinueAiChatLoading }] =
    useContinueAiChatMutation();

  const isLoading = isAiChatLoading || isContinueAiChatLoading;

  useEffect(() => {
    localStorage.removeItem("aiThreadId");
    setMessages([]);
    return () => {
      localStorage.removeItem("aiThreadId");
    };
  }, []);

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: "user",
      };

      setMessages((prev) => [...prev, userMessage]);

      const threadId = localStorage.getItem("aiThreadId");

      try {
        let responseMessage;
        if (threadId) {
          const { response } = await continueAiChat({
            message: text,
            threadId,
          }).unwrap();
          responseMessage = response;
        } else {
          const { threadId: newThreadId, response } = await aiChat({
            message: text,
          }).unwrap();
          localStorage.setItem("aiThreadId", newThreadId);
          responseMessage = response;
        }

        const aiMessage: Message = {
          id: Date.now().toString(),
          text: responseMessage,
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error sending message to AI", error);
      }
    },
    [aiChat, continueAiChat]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        sendMessage(inputMessage);
        setInputMessage("");
      }
    },
    [inputMessage, isLoading, sendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputMessage(e.target.value);
    },
    []
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
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
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  } shadow-md`}
                >
                  {message.text}
                </div>
              </div>
            ))}
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
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 p-4 flex"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`bg-green-500 text-white rounded-r-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600"
              }`}
              disabled={isLoading}
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatBox);
