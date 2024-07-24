import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { getSessionServer } from "@/lib/sessions/serverSession";

const POST = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await getSessionServer()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id;
  const documentId = params.id;
  const { content } = await request.json();

  try {
    const revision = await prisma.revision.create({
      data: {
        documentId,
        reviewerId: userId,
        content
      }
    })
    return NextResponse.json({ message: "Revision created", revision })
  } catch (error) {
    return NextResponse.json({ error: "Error creating revision" }, { status: 500 })
  }
}

const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await getSessionServer()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id;
  const documentId = params.id;

  try {
    const revision = await prisma.revision.findMany({
      where: {
        documentId,
        reviewerId: userId
      }
    })
    return NextResponse.json(revision)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching revisions" }, { status: 500 })
  }
}

export { POST, GET }
