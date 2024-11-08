const crypto = require('crypto');
const logger = require('../utils/logger');
const tokenModel = require('../models/tokenModel');
const adminModel = require('../models/adminModel');
const { default: mongoose } = require('mongoose');

const createToken = async (req, res) => {
  const { adminId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: 'Invalid Admin ID format' });
  }

  if (!adminId) {
    return res.status(400).json({ message: 'Admin ID must be provided' });
  }

  try {
    const adminExists = await adminModel.findById(adminId);
    if (!adminExists) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const newToken = crypto.randomBytes(32).toString('hex');

    const tokenDoc = new tokenModel({ token: newToken, isUsed: false, adminId });
    await tokenDoc.save();

    logger.info(`Admin with id = ${adminId} created a new token ${newToken}`);

    const tokens = (await tokenModel.find({ adminId })) || [];

    res.status(200).json(tokens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTokensByAdmin = async (req, res) => {
  const { adminId } = req.params;

  if (!adminId) {
    return res.status(400).json({ message: 'Admin ID must be provided' });
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: 'Invalid Admin ID format' });
  }

  try {
    const tokens = await tokenModel.find({ adminId });

    if (tokens.length === 0) {
      return res.status(404).json({ message: 'No tokens found for this admin' });
    }

    logger.info(`Admin ${adminId} retrieved all tokens`);

    res.status(200).json(tokens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteToken = async (req, res) => {
  const { adminId, token } = req.body;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: 'Invalid Admin ID format' });
  }

  try {
    const tokenDoc = await tokenModel.findOne({ token });

    if (!tokenDoc) {
      return res.status(404).json({ message: 'Token not found' });
    }

    if (tokenDoc.adminId.toString() !== adminId) {
      return res.status(403).json({ message: 'You are not allowed to delete this token' });
    }

    await tokenModel.deleteOne({ token });

    logger.info(`Token with value ${token} has been deleted by admin with id = ${adminId}`);

    const tokens = (await tokenModel.find({ adminId })) || [];

    res.status(200).json(tokens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = { createToken, getTokensByAdmin, deleteToken };
