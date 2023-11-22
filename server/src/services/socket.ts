import { corsOptions } from '@/config';
import http from 'http';
import { Server } from 'socket.io';

const setupSocketServer = (server: http.Server) => {
  const io = new Server(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    console.log(socket);
    console.log('a user connected');

    socket.on('comment', (commentData) => {
      io.emit('comment', commentData);
    });

    socket.on('post', (postData) => {
      io.emit('post', postData);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};

export default setupSocketServer;
