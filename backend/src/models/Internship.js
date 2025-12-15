const mongoose = require('mongoose');

module.exports = mongoose.model('Internship', new mongoose.Schema({
  company: String,
  role: String,
  skills: [String],
  location: String,
  type: String
}));
