const r = require('express').Router();
const { getInternships } = require('../controllers/internshipController');
r.get('/', getInternships);
module.exports = r;
