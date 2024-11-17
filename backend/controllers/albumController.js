const crypto = require('crypto');
const db = require('../models/db');
const fs = require('fs');
const path = require('path');
const algorithm = 'aes-256-cbc';


// ฟังก์ชันการสร้างอัลบั้ม
exports.createAlbum = async (req, res) => {
  const { user_id, name, password, hint, cover_image } = req.body;

  if (!name || !password || !hint || !cover_image) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // สร้างชื่อไฟล์ใหม่สำหรับการจัดเก็บรูปภาพ
  const filename = `cover_${Date.now()}_${Math.round(Math.random() * 1e9)}.jpg`;
  const filePath = path.join(__dirname, '../uploads', filename);

  try {
    // แปลงจาก base64
    const imageBuffer = Buffer.from(cover_image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    // บันทึกไฟล์ลงในโฟลเดอร์ uploads
    fs.writeFileSync(filePath, imageBuffer);

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Insert the album details into the database, storing the file path
    const query = 'INSERT INTO albums (user_id, name, password, hint, cover_image) VALUES (?, ?, ?, ?, ?)';
    await db.query(query, [user_id, name, hashedPassword, hint, `/uploads/${filename}`]);

    res.status(201).json({ message: 'Album created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating album.' });
  }
};
  

// ฟังก์ชันการดึงข้อมูลอัลบั้ม
exports.getAlbums = (req, res) => {
  console.log('Decoded user in getAlbums:', req.user);  // ตรวจสอบค่า req.user

  const { id: user_id } = req.user;  // ดึง user_id จาก Token โดยใช้ id จาก req.user

  if (!user_id) {
    console.log('User ID not found');
    return res.status(400).send({ message: 'User ID not found' });
  }

  console.log('Querying for user_id:', user_id);

  const query = `SELECT * FROM albums WHERE user_id = ?`;
  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send({ message: 'Server error' });
    }

    console.log('Albums found:', result);  // ตรวจสอบผลลัพธ์จากฐานข้อมูล

    res.status(200).send(result);
  });
};

exports.getAlbumById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM albums WHERE id = ?`;
  db.query(query, [id], (err, result) => {
      if (err) {
          return res.status(500).send({ message: 'Server error' });
      }
      if (result.length === 0) {
          return res.status(404).send({ message: 'Album not found' });
      }

      res.status(200).send(result[0]); // ส่งข้อมูลอัลบั้มเป็น object
  });
};


// ฟังก์ชันการยืนยันรหัสผ่านอัลบั้ม
exports.verifyAlbumPassword = (req, res) => {
  const { album_id, password } = req.body;
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const query = `SELECT * FROM albums WHERE id = ?`;
  db.query(query, [album_id], (err, result) => {
    if (err) return res.status(500).send({ message: 'Server error' });
    if (result.length === 0) return res.status(404).send({ message: 'Album not found' });

    const album = result[0];
    if (album.password !== hashedPassword) return res.status(401).send({ message: 'Incorrect album password' });

    res.status(200).send({ message: 'Password verified successfully' });
  });
};

const encryptFile = (buffer, password) => {
  const key = crypto.createHash('sha256').update(password).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  console.log('Encrypting with Key:', key.toString('hex'));
  console.log('Encrypting with IV:', iv.toString('hex'));

  return { iv, encryptedData: encrypted };
};

exports.uploadPhoto = (req, res) => {
  const { album_id } = req.body;
  const { originalname, mimetype, buffer } = req.file;

  const query = `SELECT * FROM albums WHERE id = ?`;
  db.query(query, [album_id], (err, result) => {
    if (err) return res.status(500).send({ message: 'Server error' });
    if (result.length === 0) return res.status(404).send({ message: 'Album not found' });

    const album = result[0];
    
    // เข้ารหัสรูปภาพ
    const { iv, encryptedData } = encryptFile(buffer, album.password);

    // สร้างชื่อไฟล์ใหม่สำหรับการจัดเก็บรูปภาพเข้ารหัส
    const filename = `photo_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(originalname)}`;
    const filePath = path.join(__dirname, '../encrypt_images', filename);

    // บันทึกไฟล์เข้ารหัสลงในโฟลเดอร์
    fs.writeFileSync(filePath, encryptedData);

    // บันทึก path ของไฟล์เข้ารหัสในฐานข้อมูล
    const insertQuery = `INSERT INTO photos (album_id, file_name, file_type, file_path, iv) VALUES (?, ?, ?, ?, ?)`;
    db.query(insertQuery, [album_id, originalname, mimetype, `/encrypt_images/${filename}`, iv], (err, result) => {
      if (err) return res.status(500).send({ message: 'Error uploading photo' });
      res.status(201).send({ message: 'Photo uploaded successfully' });
    });
  });
};


const decryptFile = (encryptedData, iv, password) => {
  const key = crypto.createHash('sha256').update(password).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted;
  try {
    decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]);
  } catch (err) {
    console.error('Decryption error:', err);
    throw err;
  }

  return decrypted;
};

exports.getPhotos = (req, res) => {
  const { album_id } = req.body;

  const query = `SELECT * FROM albums WHERE id = ?`;
  db.query(query, [album_id], (err, result) => {
    if (err) return res.status(500).send({ message: 'Server error' });
    if (result.length === 0) return res.status(404).send({ message: 'Album not found' });

    const { password } = result[0];

    const photoQuery = `SELECT id, file_name, file_type, file_path, iv FROM photos WHERE album_id = ?`;
    db.query(photoQuery, [album_id], (err, photos) => {
      if (err) return res.status(500).send({ message: 'Error fetching photos' });

      const base64Photos = photos.map((photo) => {
        if (photo.file_path && photo.iv) {
          try {
            // อ่านไฟล์เข้ารหัสจาก path
            const encryptedData = fs.readFileSync(path.join(__dirname, `..${photo.file_path}`));
            
            // ถอดรหัสไฟล์
            const decryptedData = decryptFile(encryptedData, photo.iv, password);

            return { 
              id: photo.id,
              file_name: photo.file_name,
              file_type: photo.file_type,
              file_data: decryptedData.toString('base64') // แปลงกลับเป็น Base64 สำหรับการแสดงผล
            };
          } catch (decryptError) {
            console.error('Decryption error:', decryptError);
            return { 
              ...photo, 
              file_data: null 
            };
          }
        } else {
          console.warn(`File path or IV is null for photo ID: ${photo.id}`);
          return { ...photo, file_data: null };
        }
      });

      res.status(200).send(base64Photos);
    });
  });
};


