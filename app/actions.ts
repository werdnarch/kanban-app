import { AddTaskData } from "@/types";

export async function createNewBoard({
  name,
  columns,
}: {
  name: string;
  columns: { column_name: string }[];
}) {
  try {
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, columns }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${res.status}`
      );
    }

    const data = await res.json();

    return {
      success: true,
      data: data,
      message: "Board added successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

export async function getSidebarBoards() {
  try {
    const res = await fetch("/api/boards");

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${res.status}`
      );
    }

    const data = await res.json();

    return {
      success: true,
      data: data,
      message: "Board successfully fetched",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

export async function addNewTask({
  name,
  currentStatus,
  subtasks,
  description,
}: AddTaskData) {
  try {
    const res = await fetch("/api/boards/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, currentStatus, subtasks, description }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${res.status}`
      );
    }

    const data = await res.json();

    return {
      success: true,
      data: data,
      message: "Task added successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

export async function getHomePageBoard() {
  try {
    const res = await fetch("/api/boards/home");

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${res.status}`
      );
    }

    const data = await res.json();

    return {
      success: true,
      data: data,
      message: "Board successfully fetched",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}
