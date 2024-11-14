const express = require('express');
const {
  createChat,
  findUserChats,
  findChat,
  findChatsBySenderName,
} = require('../controllers/chatController');

const router = express.Router();

router.post('/', createChat);
router.post('/findChatsBySenderName', findChatsBySenderName);
router.get('/:userId', findUserChats);
router.get('/find/:firstId/:secondId', findChat);

module.exports = router;
