const r = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { generate } = require('../controllers/roadmapController');
r.post('/', auth, generate);
module.exports = r;
