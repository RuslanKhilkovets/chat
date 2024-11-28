const express = require('express');
const { uploadAudio } = require('../controllers/mediaController');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('audio'), uploadAudio);

module.exports = router;
