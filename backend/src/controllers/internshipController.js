const Internship = require('../models/Internship');

exports.getInternships = async (req, res) => {
  const data = await Internship.find();
  res.json(data);
};
