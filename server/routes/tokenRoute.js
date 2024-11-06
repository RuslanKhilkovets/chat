const express = require('express');
const { createToken, getTokensByAdmin, deleteToken } = require('../controllers/tokenController');

const router = express.Router();

router.post('/create/:adminId', createToken);
router.get('/:adminId', getTokensByAdmin);
router.delete('/', deleteToken);

module.exports = router;
