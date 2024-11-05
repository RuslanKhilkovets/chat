const crypto = require('crypto');
const tokenModel = require('../models/tokenModel');

const createToken = async (req, res) => {
  try {
    const newToken = crypto.randomBytes(32).toString('hex');

    const tokenDoc = new tokenModel({ token: newToken, isUsed: false });
    await tokenDoc.save();

    res.status(201).json({ token: newToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createToken };
