import React from "react";
import PopUp from "../popup";
import { Subtask, Task } from "@/types";
import EllipsisButton from "../EllipsisButton";
import EllipsisTaskButton from "../ui/EllipsisTaskButton";

interface TaskCardModalProps {
  active: boolean;
  setActive: (state: boolean) => void;
  name: string;
  task: Task;
}

export default function TaskCardModal({
  active,
  setActive,
  name,
  task,
}: TaskCardModalProps) {
  return (
    <PopUp active={active} setActive={setActive}>
      <div className="flex flex-col gap-4 w-full p-2 md:p-4">
        <header className="flex items-center justify-between">
          <h1 className="font-bold">{name}</h1>
          <EllipsisTaskButton taskData={task} />
        </header>
      </div>
    </PopUp>
  );
}
