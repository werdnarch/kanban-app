"use client";
import React, { act, useState } from "react";
import Logo from "./Logo";
import BlueButton from "./BlueButton";
import EllipsisButton from "./EllipsisButton";
import { BoardType } from "@/types";
import AddTaskModal from "./modals/AddTaskModal";

interface HeaderProps {
  board: BoardType;
}

export default function Header({ board }: HeaderProps) {
  const [active, setActive] = useState(false);
  return (
    <header className="w-full flex items-center justify-between h-[10vh] max-h-[200px] containers">
      <div className="w-[20%] max-w-[300px] h-full flex items-center p-4 md:p-8">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-between p-4 md:p-8">
        <h1 className="text-2xl font-bold">{board.name}</h1>

        <div className="flex items-center gap-8">
          <BlueButton onClick={() => setActive(true)}>
            <p>+ Add New Task</p>
          </BlueButton>

          <EllipsisButton board={board} />
        </div>
      </div>
      <AddTaskModal
        columns={board.columns}
        active={active}
        setActive={setActive}
      />
    </header>
  );
}
