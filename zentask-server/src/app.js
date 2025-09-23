const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173", // local frontend
    "https://zentask-client-eqddtmmsh-ankit-guptas-projects-eba5c0c3.vercel.app" // deployed frontend
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Health check
app.get('/', (req, res) => res.send('ZenTask API running 🚀'));

module.exports = app;