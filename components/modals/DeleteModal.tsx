import { deleteBoardById } from "@/app/boards/[id]/actions";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteModalProps {
  id: string;
  boardName: string;
  onCancel: () => void;
  setActive: (state: boolean) => void;
}

export default function DeleteModal({
  id,
  onCancel,
  boardName,
  setActive,
}: DeleteModalProps) {
  const router = useRouter();
  const mutations = useMutation({
    mutationFn: deleteBoardById,
    onSuccess: (data) => {
      toast.success(data.message);
      setActive(false);
      router.push("/");
    },
    onError: (data) => {
      toast.error(data.message);
      setActive(false);
    },
  });

  return (
    <div className="w-full p-3 flex flex-col gap-5 md:gap-8">
      <h1 className="text-lg  text-red-500 font-bold">Delete this board?</h1>
      <p className="text-sm text-zinc-400">
        Are you sure you want to delete the "{boardName}" board? This action
        will remove all columns and tasks and cannot be reversed.
      </p>

      <div className="flex items-center justify-between gap-4 md:gap-8">
        <button
          onClick={() => mutations.mutate(id)}
          className="flex-1 cursor-pointer hover:bg-red-300 transition-all duration-200 ease-in-out bg-red-500 max-w-[200px] p-3 rounded-full text-sm font-bold"
        >
          <p>Delete</p>
        </button>

        <button
          onClick={onCancel}
          className="flex-1 cursor-pointer text-[#635fc7] hover:bg-zinc-200 transition-all duration-200 ease-in-out bg-white max-w-[200px] p-3 rounded-full text-sm font-bold"
        >
          <p>Cancel</p>
        </button>
      </div>
    </div>
  );
}
