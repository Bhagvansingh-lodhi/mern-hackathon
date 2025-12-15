const r = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { updateProfile } = require('../controllers/profileContollers');

// PUT /api/profile
r.put('/', auth, updateProfile);

module.exports = r;