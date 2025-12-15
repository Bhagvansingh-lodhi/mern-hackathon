const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  career: {
    type: String,
    required: true
  },

  content: {
    type: Object,   // 👈 IMPORTANT CHANGE
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
