const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      ref: 'Chat',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    audioPath: {
      type: String,
      required: false,
    },
    messageType: {
      type: String,
      enum: ['text', 'audio'],
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
