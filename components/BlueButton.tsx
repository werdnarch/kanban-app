import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "submit" | "button";
  column?: boolean;
  disabled?: boolean;
}

export default function BlueButton({
  children,
  onClick,
  type = "button",
  className,
  column = false,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={` ${
        column
          ? "text-[#635fc7] bg-white hover:bg-[#a5a1fd]"
          : "bg-[#635fc7] hover:bg-[#a5a1fd]"
      }  transition-all duration-200 ease-in-out cursor-pointer p-3 px-5 text-sm font-bold rounded-full
      ${className}`}
    >
      {children}
    </button>
  );
}
