import { AddTaskData, Column, EditTaskData } from "@/types";

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

export async function changeTaskStatus({
  id,
  column,
}: {
  id: string;
  column: Column;
}) {
  try {
    const res = await fetch("/api/boards/tasks/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, column }),
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
      message: "Status changed successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

export async function toggleSubtaskCompletion({
  id,
  isCompleted,
}: {
  id: string;
  isCompleted: boolean;
}) {
  try {
    const res = await fetch("/api/boards/tasks/subtasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, isCompleted }),
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
      message: "Subtasks changed successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

export async function deleteTaskById(id: string) {
  try {
    const res = await fetch(`/api/boards/tasks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
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
      message: "task deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

export async function editExistingTask({
  id,
  currentStatus,
  subtasks,
  name,
  description,
}: EditTaskData) {
  try {
    const res = await fetch("/api/boards/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, currentStatus, subtasks, name, description }),
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
      message: "Task edited successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}
