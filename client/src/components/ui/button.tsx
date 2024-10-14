import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
