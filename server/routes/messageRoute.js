const express = require('express');
const {
  createMessage,
  getMessages,
  markMessageAsRead,
  deleteMessage,
  editMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.post('/', createMessage);
router.get('/:chatId', getMessages);
router.patch('/read', markMessageAsRead);
router.delete('/delete/:messageId', deleteMessage );
router.patch('/edit/:messageId', editMessage);

module.exports = router;
