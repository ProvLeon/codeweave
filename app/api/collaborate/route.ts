// app/api/collaborate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import prisma from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend the server type to include the io property
type CustomServer = HttpServer & {
  io?: SocketIOServer;
};

let io: SocketIOServer | null = null;

async function verifyUser() {
  const session = await auth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function GET(req: NextRequest) {
  if (!io) {
    // Cast the server to CustomServer type
    const server = (req as any).socket.server as CustomServer;
    if (!server.io) {
      io = new SocketIOServer(server, {
        path: '/api/collaborate',
      });
      server.io = io;

      io.on('connection', async (socket) => {
        try {
          const user = await verifyUser();
          console.log(`User ${user.profile?.username} connected`);

          socket.on('join-document', (documentId) => {
            socket.join(documentId);
            console.log(`User ${user.profile?.username} joined document ${documentId}`);
          });

          socket.on('document-change', ({ documentId, content }) => {
            socket.to(documentId).emit('document-change', { documentId, content });
            console.log(`User ${user.profile?.username} changed document ${documentId}`);
          });

          socket.on('cursor-move', ({ documentId, position }) => {
            socket.to(documentId).emit('cursor-move', { position });
          });

          socket.on('disconnect', () => {
            console.log(`User ${user.profile?.username} disconnected`);
          });
        } catch (error) {
          console.error('User verification failed:', error as any);
          socket.disconnect(true);
        }
      });
    } else {
      io = server.io;
    }
  }

  return NextResponse.json({ message: 'Socket.io server is running' });
}
