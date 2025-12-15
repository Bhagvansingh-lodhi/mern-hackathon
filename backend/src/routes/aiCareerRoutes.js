const r = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { aiCareer } = require('../controllers/aiCareerController');
r.get('/career', auth, aiCareer);
module.exports = r;
