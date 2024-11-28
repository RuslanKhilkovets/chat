const bucket = require('../firebase'); 
const messageModel = require('../models/messageModel');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: 'No audio file uploaded' });
    }

    const fileName = `${uuidv4()}-${req.file.originalname}`;
    const firebaseFile = bucket.file(fileName);

    await firebaseFile.save(req.file.buffer, {
      contentType: req.file.mimetype,
    });

    const [publicUrl] = await firebaseFile.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    });

    const message = new messageModel({
      senderId: req.body.senderId,
      chatId: req.body.chatId,
      audioPath: publicUrl,
      messageType: 'audio',
      isRead: false,
    });

    await message.save();

    return res.status(200).send({ message: 'Audio uploaded successfully', data: message });
  } catch (err) {
    console.error('Error uploading audio:', err);
    return res.status(500).send({ error: 'Server error' });
  }
};

module.exports = { uploadAudio };
