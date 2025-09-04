import React from "react";
import PopUp from "../popup";
import DeleteModal from "./DeleteModal";
import { BoardType } from "@/types";
import EditModal from "./EditModal";

interface ModalProps {
  task: "edit" | "delete";
  active: boolean;
  setActive: (state: boolean) => void;
  board: BoardType;
}

export default function TaskModal({
  task,
  active,
  board,
  setActive,
}: ModalProps) {
  if (!board) return null;

  return (
    <PopUp active={active} setActive={setActive}>
      {task === "delete" ? (
        <DeleteModal
          setActive={setActive}
          id={board.id}
          boardName={board.name}
          onCancel={() => setActive(false)}
        />
      ) : (
        <EditModal setActive={setActive} board={board} active={active} />
      )}
    </PopUp>
  );
}
