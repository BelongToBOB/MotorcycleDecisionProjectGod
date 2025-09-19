require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');
const path = require('path');

// ===== Middleware =====
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// ===== Static uploads =====
app.use('/uploads', express.static('uploads'));

// ===== เสิร์ฟ React build (Vite) =====
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));

// ===== Auto load ทุกไฟล์ใน ./routes =====
const routes = readdirSync('./routes').filter(file => file.endsWith('.js'));

routes.forEach(file => {
  try {
    console.log("📂 Loading route:", file);   // 🟢 ดูว่าไฟล์ไหนกำลังโหลด
    const route = require('./routes/' + file);
    app.use('/api', route);
    console.log("✅ Mounted:", file);
  } catch (err) {
    console.error("❌ Error in route file:", file, err);
  }
});



// ===== รองรับ React Router (กันรีเฟรชแล้ว 404) =====
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
