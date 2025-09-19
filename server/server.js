require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// ===== ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/message'));
app.use('/api/motorcycles', require('./routes/motorcycle'));
app.use('/api/mototype', require('./routes/motoType'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/recommend-history', require('./routes/recommendHistory'));
app.use('/api/statistic', require('./routes/statistic'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/criteria', require('./routes/criteriaRoutes'));

// ===== START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

// ===== Serve React frontend =====
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));

// catch-all สำหรับ React Router
app.use((req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

