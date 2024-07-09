import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { auth } from "../auth/[...nextauth]/route";

const GET = async (request: Request) => {
  //const token = request.headers.get("Authorization")?.split(" ")[1]
  //const decoded = await verifyToken(token || "");
  //alert({"token": token, "decoded": decoded})
  const  session = await auth()
  //console.log({"token": token, "decoded": decoded})

  if (!session) {
    return NextResponse.json({ error: "Unauthorized", session:session }, { status: 401 }, );
  }

  const userId = session.user.id

  //const userId = typeof decoded.sub === 'string' ? decoded.sub : '';

  const documents = await prisma.document.findMany({
    where: {
      ownerId: userId,
      folder: {
        ownerId: userId,
      }

    },
    include: {
      folder: true,
    }
  })
  return NextResponse.json(documents)
}

const POST = async (request: Request) => {
  //const token = request.headers.get("Authorization")?.split(" ")[1]
  //const decoded = await verifyToken(token || "");
  //console.log({"token": token, "decoded": decoded})
  const  session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  //const userId = typeof decoded.sub === 'string' ? decoded.sub : '';
  const userId = session.user.id
  const { title, content, folderId } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
      ownerId: userId,
    }
  })

  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }
  const document = await prisma.document.create({
    data: {
      title,
      content,
      ownerId: userId,
      folderId,
    },
    include: {
      folder: true,
    }
  });
  const revision = await prisma.revision.create({
    data: {
      documentId: document.id,
      reviewerId: userId,
      content
    },
    include: {
      document: true,
    }
  });
  return NextResponse.json({document, revision})
}

export { POST, GET }
