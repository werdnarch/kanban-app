import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { boards, columns } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    const slugify = (name: string) =>
      name.trim().replace(/\s+/g, "-").toLowerCase();

    const newBoard = {
      name: data.name,
      columns: data.columns,
    };

    const [addedBoard] = await db
      .insert(boards)
      .values({
        id: uuidv4(),
        name: newBoard.name,
        user_id: user.id,
        slug: slugify(newBoard.name),
      })
      .returning();

    for (const column of data.columns) {
      await db.insert(columns).values({
        id: uuidv4(),
        board_id: addedBoard.id,
        name: column.column_name,
      });
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

export async function GET(req: NextRequest) {
  try {
    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    const userBoards = await db
      .select()
      .from(boards)
      .orderBy(desc(boards.createdAt))
      .where(eq(boards.user_id, user.id));

    return NextResponse.json(
      {
        success: true,
        boards: userBoards,
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
