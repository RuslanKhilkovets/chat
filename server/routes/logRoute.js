const express = require('express');
const { createLog } = require('../controllers/logController');
const router = express.Router();

router.get('/', createLog);

module.exports = router;
