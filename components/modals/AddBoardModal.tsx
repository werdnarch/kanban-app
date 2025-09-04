import React, { ReactNode } from "react";
import PopUp from "../popup";
import z from "zod";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BlueButton from "../BlueButton";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createNewBoard } from "@/app/actions";

const formSchema = z.object({
  name: z.string().min(1, "Cant be empty"),
  columns: z.array(
    z.object({
      column_name: z.string().min(1, "Cant be empty"),
    })
  ),
});

type FormType = z.infer<typeof formSchema>;

interface PopupProps {
  active: boolean;
  setActive: (state: boolean) => void;
}

export default function AddBoardModal({ active, setActive }: PopupProps) {
  const {
    register,
    handleSubmit,
    trigger,
    control,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      columns: [
        { column_name: "Todo" },
        { column_name: "Doing" },
        { column_name: "Done" },
      ],
    },
  });

  const addBoardMutation = useMutation({
    mutationFn: createNewBoard,
    onSuccess: (data) => {
      toast.success(data.success);
      setActive(false);
      reset();
    },

    onError: (error) => {
      toast.error(error.message);

      setActive(false);
      reset();
    },
  });

  const { isPending } = addBoardMutation;

  const onSubmit: SubmitHandler<FormType> = (data) => {
    const board = {
      name: data.name,
      columns: data.columns,
    };

    addBoardMutation.mutate(board);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const addNewColumn = async () => {
    const isValid = await trigger();

    if (!isValid) {
      toast.error("Fix errors before adding a new column");
      return;
    }

    if (fields.length >= 6) {
      toast.error("Maximum number of columns reached");
      return;
    }

    append({
      column_name: "",
    });
  };

  return (
    <PopUp
      active={active}
      setActive={setActive}
      className="flex flex-col gap-4 p-6"
    >
      <h1 className="text-lg font-bold">Add new board</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-4"
      >
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm ">
            <p>Board Name</p>
          </label>
          <div className="w-full relative">
            <input
              {...register("name")}
              type="text"
              autoComplete="off"
              className={`w-full p-3 border-1  outline-0 rounded-sm text-sm ${
                errors.name ? "border-red-500" : "border-zinc-500"
              }`}
              placeholder="e.g Web Design"
            ></input>
            {errors.name && (
              <p className="text-[0.8rem] text-red-500  absolute top-1/2 -translate-y-1/2 right-4 ">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm ">
            <p>Board Columns</p>
          </label>

          {fields.map((field, index) => (
            <div
              key={`column-field-${index}`}
              className="flex items-center gap-1"
            >
              <div className="w-full relative">
                <input
                  {...register(`columns.${index}.column_name` as const)}
                  type="text"
                  autoComplete="off"
                  className={`w-full p-3 border-1 outline-0 rounded-sm text-sm ${
                    errors.columns?.[index]?.column_name
                      ? "border-red-500"
                      : "border-zinc-500"
                  }`}
                />
                {errors.columns?.[index]?.column_name && (
                  <p className="text-[0.8rem] text-red-500 absolute top-1/2 -translate-y-1/2 right-4">
                    {errors.columns[index]?.column_name?.message}
                  </p>
                )}
              </div>
              <X
                className="cursor-pointer text-zinc-500 hover:text-red-500"
                onClick={() => remove(index)}
              />
            </div>
          ))}
        </div>

        <BlueButton onClick={addNewColumn} column={true} className="w-full">
          <p>Add New Column</p>
        </BlueButton>

        <BlueButton type="submit" className="w-full">
          {isPending ? (
            <Loader2 className="size-5 animate-spin mx-auto" />
          ) : (
            "Create New Board"
          )}
        </BlueButton>
      </form>
    </PopUp>
  );
}
