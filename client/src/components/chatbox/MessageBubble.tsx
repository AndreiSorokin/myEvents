import React from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "../../misc/chat";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatMessage = (message: Message) => {
    if (message.sender === "user") {
      return <span className="text-white">{message.text}</span>;
    }

    return (
      <ReactMarkdown
        className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:bg-gray-800 prose-pre:text-gray-100"
        components={{
          p: ({ children }) => <p className="my-1">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-4 my-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-4 my-2">{children}</ol>
          ),
          li: ({ children }) => <li className="my-0.5">{children}</li>,
          code: ({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) => (
            <code
              className={`${
                inline ? "bg-gray-200 text-gray-800 px-1 py-0.5 rounded" : ""
              } ${className || ""}`}
              {...props}
            >
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {message.text}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-lg p-3 ${
          message.sender === "user"
            ? "bg-[#4A43EC] text-white"
            : "bg-gray-100 text-gray-800"
        } shadow-md`}
      >
        {formatMessage(message)}
        {message.isTyping}
      </div>
    </div>
  );
};
