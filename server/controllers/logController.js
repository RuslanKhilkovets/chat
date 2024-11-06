const Log = require('../models/logModel');

const getAllLogs = async (req, res) => {
  try {
    const { level, startDate, endDate } = req.query;

    const query = {};
    if (level) query.level = level;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(query).sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs', error: err });
  }
};

module.exports = { getAllLogs };
