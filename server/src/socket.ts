import http from 'http';
import socketio from 'socket.io';

import { isAuthorized } from '@/utils/middlewares';
import { usersOnlineService } from '@/resources/users';

export const initSocket = (httpServer: http.Server) => {
  const io = new socketio.Server(httpServer, {
    cors: {
      credentials: true,
    },
  });

  io.engine.use(isAuthorized);

  io.on('connection', async (socket) => {
    const user = socket.request.user!;
    await usersOnlineService.setOnline(user.id);

    socket.on('disconnect', async () => {
      await usersOnlineService.setOffline(user.id);
    });
  });
};
