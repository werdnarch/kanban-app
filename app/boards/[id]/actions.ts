import { EditBoardData, GetBoardResponse } from "@/types";

export async function getBoardByName(boardName: string) {
  try {
    const res = await fetch(`/api/boards/${boardName}`);

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${res.status}`
      );
    }

    const data: GetBoardResponse = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    } as GetBoardResponse;
  }
}

export async function deleteBoardById(id: string) {
  try {
    const res = await fetch(`/api/boards/id/${id}`, {
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
      message: "Board deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}
export async function editBoardById({
  id,
  board,
}: {
  id: string;
  board: EditBoardData;
}) {
  try {
    const res = await fetch(`/api/boards/id/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, board }),
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
      message: "Board edited successfully",
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}
