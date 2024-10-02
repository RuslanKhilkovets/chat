const { Server } = require('socket.io');

const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

let onlineUsers = [];

io.on('connection', socket => {
  console.log('New connection', socket.id);

  socket.on('addNewUser', userId => {
    if (!onlineUsers.some(user => user.userId === userId) && userId !== null) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }

    io.emit('getOnlineUsers', onlineUsers);
  });

  socket.on('sendMessage', message => {
    const user = onlineUsers.find(user => user.userId === message.recipientId);

    if (user) {
      io.to(user.socketId).emit('getMessage', message);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    console.log('User disconnected', socket.id);

    io.emit('getOnlineUsers', onlineUsers);
  });
});

io.listen(3000);
