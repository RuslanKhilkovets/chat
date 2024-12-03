const chatModel = require('../models/chatModel');
const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    if (!firstId || !secondId)
      return res.status(400).json({ message: 'Creating chat requires at least 2 members' });

    const chat = await chatModel.findOne({ members: { $all: [firstId, secondId] } });

    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = new chatModel({ members: [firstId, secondId] });

    const response = await newChat.save();

    logger.info(`Created chat with users: ${firstId} and ${secondId}`);

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({ members: { $in: [userId] } });

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findOne({ members: { $all: [firstId, secondId] } });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChatsBySenderName = async (req, res) => {
  const { senderName, currentUserId: userId } = req.body;

  try {
    const chats = await chatModel.find({ members: { $in: [userId] } });

    const filteredChats = await Promise.all(
      chats.map(async chat => {
        const recipientId = chat.members.find(id => id !== userId);

        if (recipientId) {
          const recipient = await userModel.findById(recipientId);

          if (recipient && recipient.name.toLowerCase().includes(senderName.toLowerCase())) {
            return chat;
          }
        }
        return null;
      }),
    );

    const result = filteredChats.filter(chat => chat !== null);

    console.log('result', result);

    res.status(200).json({ chats: result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const deletedChat = await chatModel.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    await messageModel.deleteMany({ chatId });

    logger.info(`Deleted chat with ID: ${chatId} and all associated messages`);

    res
      .status(200)
      .json({ message: 'Chat and associated messages deleted successfully', chat: deletedChat });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred while deleting the chat and messages', error });
  }
};

module.exports = { createChat, findChat, findUserChats, findChatsBySenderName, deleteChat };
