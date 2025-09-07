import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { boards, columns, subtasks as subtasksTable, tasks } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { task } from "better-auth/react";

export async function POST(req: NextRequest) {
  try {
    const { name, currentStatus, description, subtasks } = await req.json();

    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    const [newTask] = await db
      .insert(tasks)
      .values({
        id: uuidv4(),
        title: name,
        status: currentStatus.name,
        column_id: currentStatus.id,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (subtasks && subtasks.length > 0) {
      await db.insert(subtasksTable).values(
        subtasks.map((subtask: { subtask_name: string }) => ({
          id: uuidv4(),
          task_id: newTask.id,
          title: subtask.subtask_name,
          isCompleted: false,
        }))
      );
    }

    return NextResponse.json(
      {
        success: true,
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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    await db.delete(tasks).where(eq(tasks.id, id));

    return NextResponse.json(
      {
        success: true,
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

export async function PUT(req: NextRequest) {
  try {
    const { id, name, currentStatus, description, subtasks } = await req.json();

    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    const EditedTask = {
      id: id,
      name: name,
      currentStatus: currentStatus,
      description: description,
      subtasks: subtasks,
    };

    console.log(EditedTask);

    return NextResponse.json(
      {
        success: true,
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
