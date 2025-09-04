"use client";

import React, { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Task } from "@/types";

interface EllipsisProps {
  taskData: Task;
}

export default function EllipsisTaskButton({ taskData }: EllipsisProps) {
  const [active, setActive] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [task, setTask] = useState<"edit" | "delete">("edit");
  const [menu, setMenu] = useState(false);

  useClickOutside([popupRef, buttonRef] as React.RefObject<HTMLElement>[], () =>
    setActive(false)
  );

  return (
    <div className="relative">
      <button
        onClick={() => {
          setActive((prev) => !prev);
        }}
        ref={buttonRef}
        className="text-[#828FA3] hover:text-zinc-100 transition-all duration-200 ease-in-out cursor-pointer"
      >
        <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg">
          <g fill="currentColor" fillRule="evenodd">
            <circle cx="2.308" cy="2.308" r="2.308" />
            <circle cx="2.308" cy="10" r="2.308" />
            <circle cx="2.308" cy="17.692" r="2.308" />
          </g>
        </svg>
      </button>
      <div
        ref={popupRef}
        className={`bg-white absolute top-full right-0 text-sm mt-1 popup rounded-sm shadow-lg shadow-[#635fc7]/20 min-w-[100px] flex flex-col gap-4 text-left p-4 ${
          active ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } transition-all duration-200 ease-in-out`}
      >
        <p
          onClick={() => {
            setTask("edit");
            setActive(false);
            setMenu(true);
          }}
          className={`whitespace-nowrap text-zinc-500 hover:text-zinc-300 cursor-pointer  w-full`}
        >
          Edit Task
        </p>

        <p
          onClick={() => {
            setTask("delete");
            setActive(false);
            setMenu(true);
          }}
          className={`whitespace-nowrap text-red-500 hover:text-red-300 cursor-pointer w-full`}
        >
          Delete Task
        </p>
      </div>
    </div>
  );
}
