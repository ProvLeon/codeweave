// lib/socket.ts
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export const initSocketIO = (server: HttpServer) => {
  if (!io) {
    io = new SocketIOServer(server, {
      path: '/api/collaborate',
    });

    io.on('connection', (socket) => {
      console.log(`User connected`);

      socket.on('join-document', (documentId) => {
        socket.join(documentId);
        console.log(`User joined document ${documentId}`);
      });

      socket.on('document-change', ({ documentId, content }) => {
        socket.to(documentId).emit('document-change', { documentId, content });
        console.log(`Document ${documentId} changed`);
      });

      socket.on('cursor-move', ({ documentId, position }) => {
        socket.to(documentId).emit('cursor-move', { position });
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected`);
      });
    });
  }
  return io;
};
