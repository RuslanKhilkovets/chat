const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    isUsed: { type: Boolean },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Token', tokenSchema);
