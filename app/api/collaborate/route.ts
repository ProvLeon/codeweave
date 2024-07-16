import { Server } from "socket.io"
import { NextRequest, NextResponse } from "next/server"
import { Server as HttpServer } from "http"

const ioHandler = (req: NextRequest, res: NextResponse) => {
  const server = (res as any).socket?.server;
  if (server && !server.io) {
    console.log("Setting up Socket.io server...");
    const io = new Server(server as HttpServer, {
      path: "/api/collaborate",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("join-document", (documentId) => {
        socket.join(documentId);
        console.log(`User joined document: ${documentId}`);
      });

      socket.on("leave-document", (documentId) => {
        socket.leave(documentId);
        console.log(`User left document: ${documentId}`);
      });

      socket.on("document-change", (documentId, change) => {
        socket.to(documentId).emit("document-change", change);
        console.log(`Document change in ${documentId}: ${change}`);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

    server.io = io;
  } else {
    console.log("Socket.io server already set up");
  }
  return NextResponse.json({ message: 'Success' });
}

export const GET = ioHandler;
export const POST = ioHandler;
