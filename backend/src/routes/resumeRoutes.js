const r = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { analyze } = require('../controllers/resumeController');
r.post('/', auth, analyze);
module.exports = r;
