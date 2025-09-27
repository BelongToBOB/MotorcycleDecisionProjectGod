require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// ===== Middleware =====
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// ===== Debug Request Logger =====
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});


// ===== Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/message', require('./routes/message'));
app.use('/api/motorcycle', require('./routes/motorcycle'));
app.use('/api/mototype', require('./routes/motoType'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/recommend-history', require('./routes/recommendHistory'));
app.use('/api/statistic', require('./routes/statistic'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/criteria', require('./routes/criteriaRoutes'));

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

// ===== Serve React frontend only in production =====
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
  app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});
}
