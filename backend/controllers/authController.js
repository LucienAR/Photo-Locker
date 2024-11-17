// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.query(query, [email, hashedPassword], (err, result) => {
      if (err) return res.status(500).send({ message: 'Error registering user' });
      res.status(201).send({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const query = `SELECT * FROM users WHERE email = ?`;
      db.query(query, [email], async (err, result) => {
        if (err) return res.status(500).send({ message: 'Server error' });
        if (result.length === 0) return res.status(404).send({ message: 'The e-mail address or password you entered was incorrect.' });
  
        const user = result[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send({ message: 'The e-mail address or password you entered was incorrect.' });
  
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
        // ส่งข้อมูลผู้ใช้ที่ต้องการกลับไปพร้อมกับ token
        res.status(200).send({
          message: 'Login successful',
          token,
          user: {
            id: user.id,      // แสดง ID ของผู้ใช้
            email: user.email, // แสดง Email ของผู้ใช้
          },
        });
      });
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
};

// controllers/authController.js

exports.logout = (req, res) => {
  // ล้าง session (เช่น สำหรับ session-based authentication)
  if (req.session) {
      req.session.destroy(err => {
          if (err) {
              return res.status(500).send({ message: 'Logout failed' });
          }
          res.clearCookie('connect.sid'); // ลบ cookie ของ session
          return res.status(200).send({ message: 'Successfully logged out' });
      });
  } else {
      // ลบ token (เช่น สำหรับ token-based authentication เช่น JWT)
      res.status(200).send({ message: 'Successfully logged out' });
  }
};

  
  
  
