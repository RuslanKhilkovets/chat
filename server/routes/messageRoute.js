const express = require('express');
const {
  createMessage,
  getMessages,
  markMessageAsRead,
} = require('../controllers/messageController');

const router = express.Router();

router.post('/', createMessage);
router.get('/:chatId', getMessages);
router.patch('/read', markMessageAsRead);

module.exports = router;
