const r = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileContollers');

// GET /api/profile
r.get('/', auth, getProfile);
// PUT /api/profile
r.put('/', auth, updateProfile);

module.exports = r;
