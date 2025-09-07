import { Task } from "@/types";
import React, { useRef, useState } from "react";
import TaskCardModal from "../modals/TaskCardModal";
import { Column } from "@/types";

interface TaskCardProps {
  task: Task;
  columns: Column[];
}

export default function TaskCard({ task, columns }: TaskCardProps) {
  const [active, setActive] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => {
          setActive(true);
        }}
        className="rounded-sm p-4 min-h-[100px] cursor-pointer group flex flex-col justify-center gap-3 containers shadow-lg shadow-[#635fc7]/5"
      >
        <h3 className="font-bold group-hover:text-[#635fc7] transition-all duration-100 ease-in-out">
          {task.title}
        </h3>

        <p className="text-[0.8rem] text-grey font-bold">
          {task.subtasks.filter((st) => st.isCompleted).length} of{" "}
          {task.subtasks.length} Subtasks
        </p>
      </div>
      <TaskCardModal
        active={active}
        setActive={setActive}
        task={task}
        name={task.title}
        columns={columns}
      />
    </>
  );
}
