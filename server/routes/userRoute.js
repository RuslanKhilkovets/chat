const express = require('express');
const {
  registerUser,
  loginUser,
  findUser,
  getUser,
  findUsersByName,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/find/:userId', findUser);
router.get('/', getUser);
router.get('/find', findUsersByName);

module.exports = router;
