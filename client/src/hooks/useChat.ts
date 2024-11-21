import { useState, useCallback } from "react";
import {
  useAiChatMutation,
  useContinueAiChatMutation,
} from "../api/eventsSlice";
import { Message } from "../misc/chat";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiChat, { isLoading: isAiChatLoading }] = useAiChatMutation();
  const [continueAiChat, { isLoading: isContinueAiChatLoading }] =
    useContinueAiChatMutation();

  const isLoading = isAiChatLoading || isContinueAiChatLoading;

  const simulateTyping = useCallback((text: string, messageId: string) => {
    let index = 0;
    const typingSpeed = 50;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isTyping: true, text: "" } : msg
      )
    );

    const typeChar = () => {
      if (index < text.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, text: text.slice(0, index + 1) }
              : msg
          )
        );
        index++;
        setTimeout(typeChar, typingSpeed);
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isTyping: false } : msg
          )
        );
      }
    };

    typeChar();
  }, []);

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

        const aiMessageId = Date.now().toString();
        const aiMessage: Message = {
          id: aiMessageId,
          text: "",
          sender: "ai",
          isTyping: true,
        };

        setMessages((prev) => [...prev, aiMessage]);
        simulateTyping(responseMessage, aiMessageId);
      } catch (error) {
        console.error("Error sending message to AI", error);
      }
    },
    [aiChat, continueAiChat, simulateTyping]
  );

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
  };
};
