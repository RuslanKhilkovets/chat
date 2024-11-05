const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const adminRoute = require('./routes/adminRoute');
const tokenRoute = require('./routes/tokenRoute');
const messageRoute = require('./routes/messageRoute');
const logRoute = require('./routes/logRoute');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);
app.use('/api/token', tokenRoute);
app.use('/api/logs', logRoute);

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

const expressServer = app.listen(port, (req, res) => {
  console.log(`server: ${port}`);
});

mongoose
  .connect(uri)
  .then(() => {
    console.log('mongo connnected ');
  })
  .catch(err => {
    console.log(`mongo error ${err.message}`);
  });

const io = new Server(expressServer, {
  cors: {
    origin: '*',
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
      io.to(user.socketId).emit('getNotification', {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    console.log('User disconnected', socket.id);

    io.emit('getOnlineUsers', onlineUsers);
  });
});
