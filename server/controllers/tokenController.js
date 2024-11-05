const crypto = require('crypto');
const tokenModel = require('../models/tokenModel');
const logger = require('../utils/logger');

const createToken = async (req, res) => {
  try {
    const newToken = crypto.randomBytes(32).toString('hex');

    const tokenDoc = new tokenModel({ token: newToken, isUsed: false });
    await tokenDoc.save();

    logger.info('Admin created new token');

    res.status(201).json({ token: newToken, isUsed: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createToken };
