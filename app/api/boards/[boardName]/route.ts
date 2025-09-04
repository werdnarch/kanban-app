import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { boards, columns, subtasks, tasks } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  context: { params: { boardName: string } } // <- plain object
) {
  try {
    const { boardName } = context.params;

    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    const userBoard = await db
      .select()
      .from(boards)
      .where(and(eq(boards.user_id, user.id), eq(boards.slug, boardName)));

    if (userBoard.length > 0) {
      const board = userBoard[0];

      // Fetch columns for the board
      const userColumns = await db
        .select()
        .from(columns)
        .where(eq(columns.board_id, board.id));

      // Fetch tasks for those columns
      const columnIds = userColumns.map((col) => col.id);
      const userTasks = await db
        .select()
        .from(tasks)
        .where(inArray(tasks.column_id, columnIds));

      // Fetch subtasks for those tasks
      const taskIds = userTasks.map((task) => task.id);
      const userSubtasks = await db
        .select()
        .from(subtasks)
        .where(inArray(subtasks.task_id, taskIds));

      // Attach subtasks to tasks
      const tasksWithSubtasks = userTasks.map((task) => ({
        ...task,
        subtasks: userSubtasks.filter((subtask) => subtask.task_id === task.id),
      }));

      // Attach tasks (with subtasks) to columns
      const columnsWithTasks = userColumns.map((col) => ({
        ...col,
        tasks: tasksWithSubtasks.filter((task) => task.column_id === col.id),
      }));

      // Attach columns to board
      const boardWithColumns = {
        ...board,
        columns: columnsWithTasks,
      };

      return NextResponse.json(
        {
          success: true,
          board: boardWithColumns,
        },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
