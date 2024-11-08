const express = require('express');
const { getAllLogs } = require('../controllers/logController');
const router = express.Router();

router.get('/', getAllLogs);

module.exports = router;
