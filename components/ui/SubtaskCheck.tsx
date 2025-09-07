import { toggleSubtaskCompletion } from "@/app/actions";
import { Subtask } from "@/types";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

interface SubtaskCheckProps {
  subtask: Subtask;
}
export default function SubtaskCheck({ subtask }: SubtaskCheckProps) {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (!subtask) return;

    setChecked(subtask.isCompleted);
  }, [subtask]);

  const toggleSubtask = useMutation({
    mutationFn: toggleSubtaskCompletion,
  });

  return (
    <label className="flex text-sm gap-2 bg-[#20212c] p-3">
      <input
        checked={checked}
        onChange={() => {
          const newValue = !checked;
          setChecked(newValue);
          toggleSubtask.mutate({ id: subtask.id, isCompleted: newValue });
        }}
        type="checkbox"
      ></input>

      <p className="font-semibold">{subtask.title}</p>
    </label>
  );
}
