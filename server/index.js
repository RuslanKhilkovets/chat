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
const mediaRoute = require('./routes/mediaRoute');

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
app.use('/api/media', mediaRoute);

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

const expressServer = app.listen(port, (req, res) => {
  console.log(`server: ${port}`);
});

mongoose
  .connect(uri)
  .then(() => {
    console.log('mongo connected');
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

let onlineUsers = new Map();

io.on('connection', socket => {
  console.log('New connection', socket.id);

  socket.emit('getOnlineUsers', Array.from(onlineUsers.values()));

  socket.on('addNewUser', userId => {
    if (!onlineUsers.has(userId) && userId !== null) {
      onlineUsers.set(userId, { userId, socketId: socket.id });
    }

    io.emit('getOnlineUsers', Array.from(onlineUsers.values()));
  });

  socket.on('sendMessage', message => {
    const user = onlineUsers.get(message.recipientId);

    if (user) {
      io.to(user.socketId).emit('getMessage', message);
      io.to(user.socketId).emit('getNotification', {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on('typingStart', ({ chatId, senderId, recipientId }) => {
    const recipient = onlineUsers.get(recipientId);

    if (recipient) {
      io.to(recipient.socketId).emit('typingStart', { chatId, senderId });
    }
  });

  socket.on('typingStop', ({ chatId, senderId, recipientId }) => {
    const recipient = onlineUsers.get(recipientId);

    if (recipient) {
      io.to(recipient.socketId).emit('typingStop', { chatId, senderId });
    }
  });

  socket.on('recordingStart', ({ chatId, senderId, recipientId }) => {
    const recipient = onlineUsers.get(recipientId);

    if (recipient) {
      io.to(recipient.socketId).emit('recordingStart', { chatId, senderId });
    }
  });

  socket.on('recordingStop', ({ chatId, senderId, recipientId }) => {
    const recipient = onlineUsers.get(recipientId);

    if (recipient) {
      io.to(recipient.socketId).emit('recordingStop', { chatId, senderId });
    }
  });

  socket.on('messageRead', async ({ chatId, messageIds, senderId, recipientId }) => {
    messageIds.forEach(messageId => {
      const sender = onlineUsers.get(senderId);

      if (sender) {
        io.to(sender.socketId).emit('messageRead', { chatId, messageId });
      }

      const recipient = onlineUsers.get(recipientId);

      if (recipient) {
        io.to(recipient.socketId).emit('messageRead', { chatId, messageId });
      }
    });
  });

  socket.on('disconnect', () => {
    for (let [userId, user] of onlineUsers) {
      if (user.socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log('User disconnected', socket.id);

    io.emit('getOnlineUsers', Array.from(onlineUsers.values()));
  });
});
