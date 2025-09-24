const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// ✅ Allowed origins (explicit + regex for Vercel previews)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://zentask-client-eqddtmmsh-ankit-guptas-projects-eba5c0c3.vercel.app", // your production frontend
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests (e.g. Postman)
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) // ✅ allow all Vercel preview deployments
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Health check
app.get('/', (req, res) => res.send('ZenTask API running 🚀'));

module.exports = app;