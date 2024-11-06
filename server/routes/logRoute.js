const express = require('express');
const { getAllLogs } = require('../controllers/logController');
const router = express.Router();

router.post('/', getAllLogs);

module.exports = router;
