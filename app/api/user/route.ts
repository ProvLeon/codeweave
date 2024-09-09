import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionServer } from "@/lib/Session";

export async function GET(req: NextRequest) {
  try {

    const session = await getSessionServer();
    const userId = session?.user.id;

    const userDetails = await prisma.user.findUnique({ where: { id: userId } });

    if (!userDetails) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userDetails, { status: 200 });

  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json({ error: "Error processing the request" }, { status: 500 });
  }
}
