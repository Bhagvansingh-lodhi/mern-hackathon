const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ],
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
