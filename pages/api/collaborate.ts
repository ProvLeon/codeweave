import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
//import { getSession } from 'next-auth/react';
import { NextApiResponseServerIo } from '@/types';

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server as any;
    const io = new Server(httpServer);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('join-document', (documentId) => {
        socket.join(documentId);
        socket.to(documentId).emit('user-joined', socket.id);
      });

      socket.on('document-change', ({ id, content }) => {
        socket.to(id).emit('document-change', { content });
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.rooms.forEach((room) => {
          socket.to(room).emit('user-left', socket.id);
        });
      });
    });
  }
  res.end();
};

export default ioHandler;
