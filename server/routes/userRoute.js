const express = require('express');
const {
  registerUser,
  loginUser,
  findUser,
  getUser,
  findUsersByNameOrTag,
  checkPassword,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/find/:userId', findUser);
router.get('/', getUser);
router.get('/find', findUsersByNameOrTag);
router.post('/check', checkPassword);

module.exports = router;
