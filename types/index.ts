import type { Server as SocketIOServer } from 'socket.io';
import type { Server } from 'http';
import { NextApiResponse } from 'next';
//import { Server as HttpServer } from 'http';
import {Server as HttpServer, Socket } from 'net';

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: HttpServer & {
      io?: SocketIOServer;
    };
  };
};

interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string;
  updatedAt: string;
}


interface Folder {
  id: string;
  name: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  subfolders: Folder[];
  documents: Document[];
}

export type { Folder, Document };
