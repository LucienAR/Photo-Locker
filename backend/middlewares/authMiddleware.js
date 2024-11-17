const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // รับ Token จาก header

  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid or expired token.' });
    }

    // ตั้งค่า req.user ด้วยข้อมูลที่ได้รับจาก token
    req.user = user;  // user ที่ได้รับจาก jwt.verify ควรมี id, email, และข้อมูลอื่น ๆ
    console.log('Decoded user from JWT:', user);  // ตรวจสอบว่า user ถูกต้อง

    next();  // ส่งต่อให้ controller ถัดไป
  });
};

module.exports = authenticateToken;
