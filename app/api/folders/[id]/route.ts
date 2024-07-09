import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id;
  const folderId = params.id;

  try {

    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        ownerId: userId,
      },
      include: {
        subfolders: true,
        documents: true,
      }
    });

    return NextResponse.json(folder)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching folder" }, { status: 500 })
  } finally {
    return NextResponse.json([])
  }
}

const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id;
  const folderId = params.id;
  const { name, parentId } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const folder = await prisma.folder.updateMany({
      where: {
        id: folderId,
        ownerId: userId,
      },
      data: {
        name,
        //parentId,
      }
    });
    return NextResponse.json({message: "Folder updated", folder})
  } catch (error) {
    return NextResponse.json({ error: "Error updating folder" }, { status: 500 })
  }
}

const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id;
  const folderId = params.id;

  try {
    const folder = await prisma.folder.deleteMany({
      where: {
        id: folderId,
        ownerId: userId,
      },
    });
    return NextResponse.json({message: "Folder deleted", folder})
  } catch (error) {
    return NextResponse.json({ error: "Error deleting folder" }, { status: 500 })
  }
}
