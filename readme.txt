SQL database

-- Table สำหรับเก็บข้อมูลผู้ใช้
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table สำหรับการรีเซ็ตรหัสผ่านของผู้ใช้ทั่วไป
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    token_expiration DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table สำหรับเก็บข้อมูลอัลบั้ม
CREATE TABLE albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    hint VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cover_image VARCHAR(255) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table สำหรับเก็บรูปภาพ
CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `iv` varbinary(16) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Table สำหรับการรีเซ็ตรหัสผ่านของอัลบั้ม
CREATE TABLE album_password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    token_expiration DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);