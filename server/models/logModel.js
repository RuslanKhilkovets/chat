const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  meta: { type: Object, default: {} },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
