import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { getSessionServer } from "@/lib/sessions/serverSession";

const GET = async (request: Request) => {
  //const token = request.headers.get("Authorization")?.split(" ")[1]
  //const decoded = await verifyToken(token || "");
  //alert({"token": token, "decoded": decoded})
  const  session = await getSessionServer()
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
    cacheStrategy: { ttl: 60 },
    include: {
      folder: true,
    }
  })
  return NextResponse.json(documents)
}


const POST = async (request: Request) => {
  try {
    const session = await getSessionServer();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { title, content, folderId } = await request.json();

    // Log the request body to debug
    console.log("Request Body:", { title, content, folderId });

    if (!title || !folderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        ownerId: userId,
      },
      cacheStrategy: { ttl: 60 },
    });

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
        revisions: true,
      },
    });

    const revision = await prisma.revision.create({
      data: {
        documentId: document.id,
        reviewerId: userId,
        content,
      },
      include: {
        document: true,
      },
    });

    return NextResponse.json({ document, revision });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
};


export { POST, GET }
