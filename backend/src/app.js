const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || 'https://aicareercoach-eight.vercel.app/')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running successfully');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/ai', require('./routes/aiCareerRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));

module.exports = app;
