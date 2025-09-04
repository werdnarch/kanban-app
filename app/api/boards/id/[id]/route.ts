import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { boards, columns } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { slugify } from "@/helpers/slugify";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    await db
      .delete(boards)
      .where(and(eq(boards.user_id, user.id), eq(boards.id, id)));

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
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { board } = await req.json();

    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    let boardWithColumns = null;

    // Update board itself
    const [editedBoard] = await db
      .update(boards)
      .set({
        name: board.name,
        updatedAt: new Date(),
        slug: slugify(board.name),
      })
      .where(and(eq(boards.id, id), eq(boards.user_id, user.id)))
      .returning();

    // Fetch existing columns for this board
    const existingColumns = await db
      .select()
      .from(columns)
      .where(eq(columns.board_id, id));

    const existingColumnIds = existingColumns.map((col) => col.id);

    for (const column of board.columns) {
      if (existingColumnIds.includes(column.id)) {
        // Update existing column
        await db
          .update(columns)
          .set({
            name: column.column_name,
            updatedAt: new Date(),
          })
          .where(eq(columns.id, column.id));
      } else {
        // Insert new column
        await db.insert(columns).values({
          id: column.id, // from frontend (uuidv4)
          name: column.column_name,
          board_id: id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Delete columns that were removed in the frontend
    const newColumnIds = board.columns.map((col: any) => col.id);
    const columnsToDelete = existingColumns.filter(
      (col) => !newColumnIds.includes(col.id)
    );

    for (const col of columnsToDelete) {
      await db.delete(columns).where(eq(columns.id, col.id));
    }

    return NextResponse.json(
      {
        success: true,
        updatedBoard: editedBoard,
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
