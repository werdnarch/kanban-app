import { useClickOutside } from "@/hooks/useClickOutside";
import React, { ReactNode, useRef } from "react";

interface PopupProps {
  active: boolean;
  setActive: (state: boolean) => void;
  children: ReactNode;
  className?: string;
}

export default function PopUp({
  active,
  setActive,
  children,
  className,
}: PopupProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useClickOutside([popupRef], () => setActive(false));

  return (
    <div
      className={`fixed top-0 z-100 bg-black/60 left-0 w-full h-full flex items-center ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      } justify-center transition-all duration-300 ease-in-out`}
    >
      <div
        ref={popupRef}
        className={`containers w-[90%] p-4 rounded-lg popup ${
          active ? "scale-100" : "scale-90 pointer-events-none"
        } ${className} transition-all duration-300 ease-in-out max-w-[500px]`}
      >
        {children}
      </div>
    </div>
  );
}
