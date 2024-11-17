const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const albumRoutes = require('./routes/albumRoutes');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const encryptDir = path.join(__dirname, 'encrypt_images');
if (!fs.existsSync(encryptDir)) {
    fs.mkdirSync(encryptDir);
}

dotenv.config();

const app = express();

// เพิ่มตัวจัดการขนาด request body โดยกำหนด limit เป็นขนาดที่ใหญ่ขึ้น
app.use(express.json({ limit: '50mb' })); // สำหรับ JSON ขนาดใหญ่
app.use(express.urlencoded({ limit: '50mb', extended: true })); // สำหรับ URL-encoded ขนาดใหญ่

// Configure CORS to allow only the specific origin and enable credentials
app.use(cors({
  origin: 'http://localhost:3000',  // อนุญาตเฉพาะต้นทางนี้
  credentials: true,                // อนุญาตให้ส่งข้อมูล session หรือ cookies
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/albums', albumRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
