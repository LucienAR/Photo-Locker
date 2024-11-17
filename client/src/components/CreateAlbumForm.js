import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CreateAlbumForm = ({ show, handleClose, fetchAlbums }) => {
    const [albumName, setAlbumName] = useState('');
    const [albumPassword, setAlbumPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // เพิ่ม state สำหรับยืนยันรหัสผ่าน
    const [albumHint, setAlbumHint] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ฟังก์ชันสำหรับรีเซ็ตค่าในฟอร์ม
    const resetForm = () => {
        setAlbumName('');
        setAlbumPassword('');
        setConfirmPassword(''); // รีเซ็ต confirmPassword
        setAlbumHint('');
        setCoverImage(null);
        setErrorMessage('');
        setShowPassword(false);
    };

    const handleCreateAlbum = async () => {
        if (!albumName || !albumPassword || !confirmPassword || !albumHint || !coverImage) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        if (albumPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        if (albumName.length > 50) {
            setErrorMessage('Album name must not exceed 50 characters.');
            return;
        }

        if (albumPassword.length > 20) {
            setErrorMessage('Password must not exceed 20 characters.');
            return;
        }

        if (albumHint.length > 50) {
            setErrorMessage('Password hint must not exceed 50 characters.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const user_id = localStorage.getItem('user_id');
            if (!user_id) {
                setErrorMessage('User ID not found. Please log in again.');
                return;
            }

            const response = await axios.post('http://localhost:3001/api/albums/create', {
                user_id,
                name: albumName,
                password: albumPassword,
                hint: albumHint,
                cover_image: coverImage,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Album created successfully:", response.data);
            resetForm();
            handleClose();
            fetchAlbums();
        } catch (error) {
            console.error('Error creating album:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to create album');
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleModalClose = () => {
        resetForm();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Album</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Album Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={albumName}
                            onChange={(e) => setAlbumName(e.target.value)}
                            placeholder="Enter album name"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <div style={{ position: 'relative' }}>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                value={albumPassword}
                                onChange={(e) => setAlbumPassword(e.target.value)}
                                placeholder="Enter album password"
                                required
                            />
                            <span
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                onMouseDown={() => setShowPassword(true)}
                                onMouseUp={() => setShowPassword(false)}
                                onMouseLeave={() => setShowPassword(false)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <div style={{ position: 'relative' }}>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm album password"
                                required
                            />
                            <span
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                onMouseDown={() => setShowPassword(true)}
                                onMouseUp={() => setShowPassword(false)}
                                onMouseLeave={() => setShowPassword(false)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Password Hint</Form.Label>
                        <Form.Control
                            type="text"
                            value={albumHint}
                            onChange={(e) => setAlbumHint(e.target.value)}
                            placeholder="Enter password hint"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Cover Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => handleCoverImageChange(e)}
                            accept="image/*"
                            required
                        />
                    </Form.Group>
                    {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                <Button variant="primary" onClick={handleCreateAlbum}>Create Album</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateAlbumForm;
