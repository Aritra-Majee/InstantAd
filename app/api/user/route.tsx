
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
  try {
    const { userEmail, userName } = await req.json();

    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (result.length === 0) {
      const inserted = await db
        .insert(usersTable)
        .values({
          name: userName,
          email: userEmail,
          credits: 0,
        })
        .returning();

      return NextResponse.json(inserted[0]);
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}