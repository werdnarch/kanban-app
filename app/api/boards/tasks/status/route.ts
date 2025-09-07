import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { boards, columns, tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { slugify } from "@/helpers/slugify";
import { success } from "zod";

export async function PUT(req: NextRequest) {
  const { column, id } = await req.json();

  try {
    //GETTING THE USER SESSION
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    await db
      .update(tasks)
      .set({
        column_id: column.id,
        status: column.name,
      })
      .where(eq(tasks.id, id));

    return NextResponse.json({ success: true, message: "task status updated" });
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
