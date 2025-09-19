// import ....
require('dotenv').config();
const express = require('express')
const app = express()
const morgan = require('morgan')
const { readdirSync } = require('fs')
const cors = require('cors')
const path = require("path");

const uploadRoutes = require('./routes/upload');
const recommendRoute = require('./routes/recommend');
const userRoutes = require('./routes/user');
const recommendHistoryRouter = require('./routes/recommendHistory');
const statisticRoute = require('./routes/statistic');
const criteriaRoutes = require('./routes/criteriaRoutes');

// ===== เสิร์ฟ React build (Vite) =====
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));

// ===== รองรับ React Router (กันรีเฟรชแล้ว 404) =====
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// ===== ใช้พอร์ตจาก env (สำคัญมาก) =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use('/api/upload', uploadRoutes);
app.use('/api/user', require('./routes/user'));
app.use('/api/mototype', require('./routes/motoType'));
app.use('/api/motorcycle', require('./routes/motorcycle'));
app.use('/api/recommend', recommendRoute);
app.use('/api/history', require('./routes/recommendHistory'));
app.use('/api/user', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/recommend-history', recommendHistoryRouter);
app.use('/api/statistic', statisticRoute);
app.use('/api/message', require('./routes/message'));
app.use('/api', criteriaRoutes);


readdirSync('./routes')
.map((c)=> app.use('/api', require('./routes/'+c)) )


// Start server
app.listen(5000, 
    ()=> console.log('Server is running on port 5000'))