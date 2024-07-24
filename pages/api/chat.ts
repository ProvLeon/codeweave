import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { NextApiResponseServerIo } from '@/types';
import { getSessionServer } from '@/lib/Session';

const chatHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  const session = await getSessionServer()
  if (!session) {
    res.status(401).end();
    return;
  }

  if (!res.socket.server.io) {
    const httpServer = res.socket.server as any;
    const io = new Server(httpServer);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      const userId = session.user.id;

      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
      });

      socket.on('send-message', ({ roomId, message }) => {
        socket.to(roomId).emit('receive-message', { userId, message });
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.rooms.forEach((room) => {
          socket.to(room).emit('user-left', { userId, socketId: socket.id });
        });
      });
    });
  }
  res.end();
};

export default chatHandler;
