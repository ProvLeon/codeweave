import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { auth } from "../../auth/[...nextauth]/route";

const GET = async (request: Request, {params}: { params:{id:string}}) => {
  //const token = request.headers.get("Authorization")?.split(" ")[1]
  //const decoded = await verifyToken(token || "");
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //if (!decoded) {
  //  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //}
  const userId = session.user.id  //typeof decoded.sub === 'string' ? decoded.sub : '';
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
  //const token = request.headers.get("Authorization")?.split(" ")[1]
  //const decoded =await verifyToken(token || "");

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id  // typeof decoded.sub === 'string' ? decoded.sub : '';
  const documentId = params.id;
  const { title, content, folderId } = await request.json();

  //if (!title || !content) {
  //  return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  //}

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

const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const documentId = params.id;

  try {
    // Check if the document exists
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
        ownerId: userId,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete associated revisions first
    await prisma.revision.deleteMany({
      where: {
        documentId: documentId,
      },
    });

    // Then delete the document
    await prisma.document.delete({
      where: {
        id: documentId,
        ownerId: userId,
      },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
};

export { GET, PUT, DELETE };
