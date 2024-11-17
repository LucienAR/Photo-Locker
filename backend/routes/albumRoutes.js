const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');  // Importing path module
const fs = require('fs');      // For folder existence check or creation
const albumController = require('../controllers/albumController');
const authenticateToken = require('../middlewares/authMiddleware');
// Ensure 'uploads' folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create folder if not exist
}

// Define destination and filename for multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Set the folder to save files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));  // Ensure unique filename
    }
});

const upload = multer({ storage: storage });
const uploadPhoto = multer();

// Routes
router.post('/create', upload.single('cover_image'), authenticateToken, albumController.createAlbum);
router.get('/get-albums', authenticateToken, albumController.getAlbums);
router.post('/verify-password', authenticateToken, albumController.verifyAlbumPassword);
router.post('/upload-photo', authenticateToken, uploadPhoto.single('file'), albumController.uploadPhoto);
router.post('/get-photos', authenticateToken, albumController.getPhotos);

router.get('/get-album/:id', authenticateToken, albumController.getAlbumById);

module.exports = router;
