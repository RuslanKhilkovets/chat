const chatModel = require('../models/chatModel');
const messageModel = require('../models/messageModel');

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new messageModel({
    chatId,
    senderId,
    text,
    messageType: 'text',
  });

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  let { page = 1, limit = 20 } = req.query;

  try {
    const totalMessages = await messageModel.countDocuments({ chatId });

    const messages = await messageModel
      .find({ chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const hasMore = page * limit < totalMessages;

    res.status(200).json({
      messages,
      metadata: {
        totalMessages,
        currentPage: page,
        limit,
        hasMore,
      },
    });
  } catch (err) {
    console.error(`Error fetching messages for chat ${chatId}:`, err);
    res.status(500).json({
      message: 'Failed to fetch messages.',
      error: err.message,
    });
  }
};

const markMessageAsRead = async (req, res) => {
  const { chatId, messageId } = req.body;

  try {
    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const message = await messageModel.findOne({ _id: messageId, chatId });

    if (!message) {
      return res.status(404).json({ error: 'Message not found in this chat' });
    }

    message.isRead = true;
    const updatedMessage = await message.save();

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error marking message as read' });
  }
};

module.exports = { createMessage, getMessages, markMessageAsRead };
