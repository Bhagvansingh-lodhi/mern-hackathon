const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Handle CORS + preflight requests properly
const allowedOrigins = [
  "http://localhost:5173",
  "https://aicareercoach-eight.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Explicitly handle OPTIONS preflight for all routes
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('API is running successfully');
});

// ✅ Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/ai', require('./routes/aiCareerRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));

// ✅ Export app for server.js or index.js
module.exports = app;
