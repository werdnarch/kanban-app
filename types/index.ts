import { subtasks } from "@/db/schema";
import { string } from "zod";

export type WelcomeMessage = {
  message: string;
};

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  column_id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
}

export interface Column {
  id: string;
  name: string;
  board_id: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

export interface BoardType {
  id: string;
  name: string;
  user_id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  columns: Column[];
}

export interface GetBoardSuccessResponse {
  success: true;
  board: BoardType;
  message?: string;
}

export interface GetBoardErrorResponse {
  success: false;
  error: string;
  message?: string;
}

export type GetBoardResponse = GetBoardSuccessResponse | GetBoardErrorResponse;

export type EditBoardData = {
  name: string;
  columns: { id: string; column_name: string }[];
};

export type AddTaskData = {
  name: string;
  description: string;
  currentStatus: Column;
  subtasks: { subtask_name: string }[];
};
