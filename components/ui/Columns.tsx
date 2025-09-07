import { Task } from "@/types";
import React from "react";
import TaskCard from "./TaskCard";
import { Column } from "@/types";

interface ColumnProps {
  name: string;
  tasks: Task[];
  columns: Column[];
}

export default function Columns({ name, tasks, columns }: ColumnProps) {
  return (
    <div className="flex-1 max-w-[300px] h-full flex flex-col gap-4">
      <p className="tracking-widest text-sm flex items-center text-grey font-bold gap-1">
        {name} <span>({tasks.length})</span>
      </p>

      {tasks.map((task, index: number) => (
        <TaskCard key={`column-task-${index}`} task={task} columns={columns} />
      ))}
    </div>
  );
}
