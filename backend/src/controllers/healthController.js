const mongoose = require('mongoose');

const live = async (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'live',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

const ready = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        status: 'not_ready',
        db: 'disconnected',
      });
    }

    await mongoose.connection.db.admin().command({ ping: 1 });

    return res.status(200).json({
      success: true,
      status: 'ready',
      db: 'connected',
    });
  } catch (error) {
    req.log?.error({ err: error }, 'readiness check failed');

    return res.status(503).json({
      success: false,
      status: 'not_ready',
      db: 'unreachable',
    });
  }
};

module.exports = {
  live,
  ready,
};
