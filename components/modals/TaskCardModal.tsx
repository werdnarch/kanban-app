import React, { act, useEffect, useRef, useState } from "react";
import PopUp from "../popup";
import { Column, Subtask, Task } from "@/types";
import EllipsisButton from "../EllipsisButton";
import EllipsisTaskButton from "../ui/EllipsisTaskButton";
import { subtasks } from "@/db/schema";
import { ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { changeTaskStatus } from "@/app/actions";
import SubtaskCheck from "../ui/SubtaskCheck";
import TaskModal from "./TaskModal";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

interface TaskCardModalProps {
  active: boolean;
  setActive: (state: boolean) => void;
  name: string;
  task: Task;
  columns?: Column[];
}

export default function TaskCardModal({
  active,
  setActive,
  name,
  task,
  columns,
}: TaskCardModalProps) {
  const [selected, setSelected] = useState<Column>();
  const selectButtonRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const [taskMenu, setTaskMenu] = useState<"delete" | "edit" | "view">("view");

  const changeStatusMutation = useMutation({
    mutationFn: changeTaskStatus,
    onSuccess: () => {
      console.log("successfully updated status");
    },
    onError: () => {
      console.error("error while updating status");
    },
  });

  useEffect(() => {
    if (!active) {
      setTimeout(() => {
        setTaskMenu("view");
      }, 300);
    }
  }, [active]);

  useEffect(() => {
    if (!task || !columns) return;
    setSelected(columns?.find((column) => column.name === task.status));
  }, [task, columns]);

  return (
    <PopUp active={active} setActive={setActive}>
      {taskMenu === "view" ? (
        <div className="flex flex-col gap-4 w-full p-2 md:p-4">
          <header className="flex items-center justify-between ">
            <h1 className="font-bold w-[90%]">{name}</h1>
            <EllipsisTaskButton taskData={task} setTask={setTaskMenu} />
          </header>

          <p className="text-sm text-grey font-bold">{task.description}</p>

          <div className="flex flex-col gap-3">
            <label>
              <p className="text-sm text-grey font-bold">
                Subtasks ( {task.subtasks.filter((st) => st.isCompleted).length}{" "}
                of {task.subtasks.length} )
              </p>
            </label>
            <div className="flex flex-col gap-4">
              {task.subtasks.map((subtask: Subtask) => (
                <SubtaskCheck key={subtask.id} subtask={subtask} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="decription-input">
              <p className="text-sm font-bold">Current Status</p>
            </label>
            <div className="relative w-full">
              <div
                ref={selectButtonRef}
                onClick={() => setSelectOpen((prev) => !prev)}
                className={`border outline-0 p-3 text-sm  rounded-sm  w-full border-zinc-600 flex items-center justify-between`}
              >
                {selected?.name}
                <ChevronDown
                  className={`size-5 ${
                    selectOpen ? "rotate-180" : "rotate-0"
                  } text-[#635fc7] transition-all duration-150 ease-in-out`}
                />
              </div>

              <div
                ref={selectRef}
                className={`absolute containers shadow-lg shadow-[#635fc7]/40 border-zinc-100/10 rounded-md border w-full left-0 mt-1 overflow-hidden ${
                  selectOpen
                    ? "opacity-100 scale-100"
                    : "scale-95 opacity-0 pointer-events-none"
                } transition-all duration-200 ease-in-out`}
              >
                {columns?.map((column: Column, index: number) => (
                  <div
                    onClick={() => {
                      // Only trigger if selecting a different column
                      if (task.column_id !== column.id) {
                        setSelected(column);
                        setSelectOpen(false);

                        changeStatusMutation.mutate({
                          id: task.id,
                          column,
                        });
                      } else {
                        // Same column: just close the select (optional)
                        setSelectOpen(false);
                      }
                    }}
                    key={`column-${index}`}
                    className="w-full px-4 p-2 hover:bg-[#2c64e3] transition-all duration-150 ease-in-out"
                  >
                    <p className="text-sm">{column.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : taskMenu === "edit" ? (
        <EditTaskModal
          active={active}
          setActive={setActive}
          task={task}
          columns={columns ?? []}
        />
      ) : taskMenu === "delete" ? (
        <DeleteTaskModal
          name={task.title}
          id={task.id}
          setActive={setActive}
          onCancel={() => setTaskMenu("view")}
        />
      ) : null}
    </PopUp>
  );
}
