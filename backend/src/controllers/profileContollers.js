// src/controllers/profileController.js
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      ...user.toObject(),
      experienceLevel: user.experience || 'Beginner'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      skills: Array.isArray(req.body.skills) ? req.body.skills : [],
      interests: Array.isArray(req.body.interests) ? req.body.interests : [],
      experience: req.body.experienceLevel || req.body.experience || 'Beginner'
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      ...user.toObject(),
      password: undefined,
      experienceLevel: user.experience || 'Beginner'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
