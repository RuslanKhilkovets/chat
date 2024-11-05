const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    isUsed: { type: Boolean },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Token', tokenSchema);
