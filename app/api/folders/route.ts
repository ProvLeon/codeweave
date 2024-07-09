import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "../auth/[...nextauth]/route";


const GET = async (request: Request) => {
  const  session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const folders = await prisma.folder.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      subfolders: true,
      documents: true,
    }
  });
  return NextResponse.json(folders)
}

const POST = async (request: Request) => {
  const  session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { name, parentId } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const folder = await prisma.folder.create({
    data: {
      name,
      ownerId: userId,
      parentId,
    }
  });
  return NextResponse.json(folder)
}

export { GET, POST }
