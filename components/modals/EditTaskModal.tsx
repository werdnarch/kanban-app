import React, { useEffect, useRef, useState } from "react";
import PopUp from "../popup";
import { z } from "zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BlueButton from "../BlueButton";
import { toast } from "sonner";
import { ChevronDown, X } from "lucide-react";
import { Task, Column, AddTaskData as EditData } from "@/types";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useMutation } from "@tanstack/react-query";
import { addNewTask, editExistingTask } from "@/app/actions";
import { subtasks } from "@/db/schema";

const createTaskSchema = z.object({
  name: z.string().min(1, "Can't be empty"),
  description: z.string().max(200, "Maximum length exceeded").optional(),
  subtasks: z.array(
    z.object({
      subtask_name: z.string().min(1, "Cant be empty"),
    })
  ),
});

type TaskType = z.infer<typeof createTaskSchema>;

interface EditModalProps {
  active: boolean;
  setActive: (state: boolean) => void;
  task: Task;
  columns: Column[];
}

export default function EditTaskModal({
  active,
  setActive,
  columns,
  task,
}: EditModalProps) {
  const {
    handleSubmit,
    register,
    trigger,
    reset,
    formState: { errors },
    control,
  } = useForm<TaskType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: task.title,
      description: task.description,
      subtasks:
        task.subtasks.length > 0
          ? task.subtasks.map((subtask) => ({
              subtask_name: subtask.title,
            }))
          : [{ subtask_name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const addNewSubtask = async () => {
    const isValid = await trigger("subtasks");

    if (!isValid) {
      toast.error("Fix errors before adding a new subtask");
      return;
    }

    if (fields.length >= 6) {
      toast.error("Maximum number of subtasks reached");
      return;
    }

    append({
      subtask_name: "",
    });
  };

  const [selected, setSelected] = useState<Column>();
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectButtonRef = useRef<HTMLDivElement | null>(null);

  useClickOutside([selectRef, selectButtonRef], () => setSelectOpen(false));

  useEffect(() => {
    if (!columns?.length || !task) return;

    const match = columns.find((column) => column.name === task.status);
    setSelected(match ?? columns[0]);
  }, [columns, task]);

  const EditMutation = useMutation({
    mutationFn: editExistingTask,
    onSuccess: () => {
      toast.success("Sucessfully updated task");

      setTimeout(() => {
        setActive(false);
      }, 200);
      reset();
    },
    onError: () => {
      toast.error("Failed to updated task");
      setTimeout(() => {
        setActive(false);
      }, 200);
      reset();
    },
  });

  const onSubmit: SubmitHandler<TaskType> = (data) => {
    const EditedTask = {
      id: task.id,
      name: data.name,
      description: data.description ?? "",
      currentStatus: selected!,
      subtasks: data.subtasks,
    };

    EditMutation.mutate(EditedTask);
  };

  const { isPending } = EditMutation;

  return (
    <div className="flex flex-col gap-4 md:gap-6 p-3">
      <h1 className="text-lg font-bold">Add New Task</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 md:gap-6 w-full"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name-input">
            <p className="text-sm font-bold">Task Name</p>
          </label>
          <div className="relative w-full">
            <input
              autoComplete="off"
              id="name-input"
              {...register("name")}
              placeholder="e.g Take a coffee break"
              className={`border outline-0 p-3 text-sm  rounded-sm  w-full ${
                errors.name ? "border-red-500" : "border-zinc-600"
              }`}
            ></input>
            {errors.name && (
              <p className="text-[0.7rem] absolute top-1/2 -translate-y-1/2 right-4 text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="decription-input">
            <p className="text-sm font-bold">Description</p>
          </label>
          <div className="relative w-full">
            <textarea
              autoComplete="off"
              id="decription-input"
              {...register("description")}
              placeholder="e.g. It's always good to take a break. This  15 minute break will  recharge the batteries  a little."
              className={`border outline-0 p-3 min-h-[100px] resize-none text-sm  rounded-sm  w-full ${
                errors.name ? "border-red-500" : "border-zinc-600"
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-[0.7rem] absolute top-1/2 -translate-y-1/2 right-4 text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label>
            <p className="text-sm font-bold">Subtasks</p>
          </label>
          {fields.map((field, index) => (
            <div
              key={`column-field-${index}`}
              className="flex items-center gap-1"
            >
              <div className="w-full relative">
                <input
                  {...register(`subtasks.${index}.subtask_name` as const)}
                  type="text"
                  autoComplete="off"
                  className={`w-full p-3 border-1 outline-0 rounded-sm text-sm ${
                    errors.subtasks?.[index]?.subtask_name
                      ? "border-red-500"
                      : "border-zinc-500"
                  }`}
                />
                {errors.subtasks?.[index]?.subtask_name && (
                  <p className="text-[0.8rem] text-red-500 absolute top-1/2 -translate-y-1/2 right-4">
                    {errors.subtasks[index]?.subtask_name?.message}
                  </p>
                )}
              </div>
              <X
                className="cursor-pointer text-zinc-500 hover:text-red-500"
                onClick={() => remove(index)}
              />
            </div>
          ))}

          <BlueButton
            disabled={isPending}
            onClick={addNewSubtask}
            type="submit"
            column={true}
          >
            <p>Create Subtask</p>
          </BlueButton>
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
              {columns.map((column: Column, index: number) => (
                <div
                  onClick={() => {
                    setSelected(column);
                    setSelectOpen(false);
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
        <BlueButton disabled={isPending} type="submit">
          <p>Create Task</p>
        </BlueButton>
      </form>
    </div>
  );
}
