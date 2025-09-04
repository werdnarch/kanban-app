import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { boards, columns, tasks, subtasks } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    const [userBoard] = await db
      .select()
      .from(boards)
      .where(eq(boards.user_id, user.id))
      .orderBy(desc(boards.createdAt))
      .limit(1);

    if (userBoard) {
      // Fetch columns for the board
      const userColumns = await db
        .select()
        .from(columns)
        .where(eq(columns.board_id, userBoard.id));

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
        ...userBoard,
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

    return NextResponse.json(
      {
        success: true,
        board: null,
      },
      { status: 200 }
    );
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
