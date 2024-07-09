// app/api/collaborate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initSocketIO } from "@/lib/socket";
import { Server as HttpServer } from "http";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export const config = {
  api: {
    bodyParser: false,
  },
};

let ioInitialized = false;

export default async function handler(req: NextRequest) {
  if (req.method === "GET") {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Ensure the request is a WebSocket upgrade
    if (!ioInitialized) {
      const server = (req as any).socket.server as HttpServer;
      initSocketIO(server);
      ioInitialized = true;
      console.log("Socket.io server initialized");
    }

    return new NextResponse("Socket.io server is running");
  }

  return new NextResponse("Method not allowed", { status: 405 });
}
