import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { auth } from "../../auth/[...nextauth]/route";

const GET = async (request: Request, {params}: { params:{id:string}}) => {
  const token = request.headers.get("Authorization")?.split(" ")[1]
  const decoded = await verifyToken(token || "");

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = typeof decoded.sub === 'string' ? decoded.sub : '';
  const documentId = params.id;

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
      ownerId: userId,
    },
    include: {
      folder: true,
    }
  })

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(document)
}

const PUT = async (request: Request, {params}: { params:{id:string}}) => {
  const token = request.headers.get("Authorization")?.split(" ")[1]
  const decoded =await verifyToken(token || "");

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = typeof decoded.sub === 'string' ? decoded.sub : '';
  const documentId = params.id;
  const { title, content, folderId } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const document = await prisma.document.updateMany({
    where: {
      id: documentId,
      ownerId: userId,
    },
    data: {
      title,
      content,
      folderId,
    },
  })
  if (document.count === 0) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Document updated successfully" }, { status: 200 });
}

const DELETE = async (request: Request, {params}: { params:{id:string}}) => {
  //const token = request.headers.get("Authorization")?.split(" ")[1]
  //const decoded = await verifyToken(token || "");
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id // typeof decoded.sub === 'string' ? decoded.sub : '';
  const documentId = params.id;

  try {
    await prisma.document.deleteMany({
      where: {
        id: documentId,
        ownerId: userId,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Document deleted successfully" }, { status: 200 });
}

export { GET, PUT, DELETE };
