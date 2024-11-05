const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  isUsed: { type: Boolean },
  createdAt: { type: Date, default: Date.now, expires: '1d' },
});

module.exports = mongoose.model('Token', tokenSchema);
