import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Alert} from 'react-bootstrap';
import CreateAlbumForm from '../components/CreateAlbumForm';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import AppNavbar from '../components/Navbar';

const Home = () => {
    const navigate = useNavigate(); // สร้างตัวแปร navigate
    const [albums, setAlbums] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedAlbumHint, setSelectedAlbumHint] = useState('');
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockPassword, setUnlockPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า Login ถ้าไม่ได้ล็อกอิน
        }
        // รหัสอื่น ๆ ของ Home
        fetchAlbums();
    }, [navigate]);

    const fetchAlbums = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/albums/get-albums', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAlbums(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnlockAlbum = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:3001/api/albums/verify-password',
                { album_id: selectedAlbum, password: unlockPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                navigate(`/showalbum/${selectedAlbum}`);
            }

            setShowUnlockModal(false); // ปิดโมดัล
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('รหัสผ่านไม่ถูกต้อง');
            } else {
                setErrorMessage('เกิดข้อผิดพลาดในการยืนยันรหัสผ่าน');
            }
        }
    };

    const handleAlbumClick = (album) => {
        setSelectedAlbum(album.id);
        setSelectedAlbumHint(album.hint);
        setShowUnlockModal(true);
        setErrorMessage('');
        setUnlockPassword('');
    };

    return (
        <>
            <AppNavbar onCreateAlbum={() => setShowCreateModal(true)} />

            <Container
                className="mt-5 mb-5 p-4"
                style={{
                    borderRadius: '15px',
                    backgroundColor: '#f8f9fa',
                    maxWidth: '90%', // ปรับให้ Container กว้างขึ้น (ลดขอบ)
                    width: '100%', // ใช้ความกว้างเต็ม
                }}
            >
                <h2 className="text-center mb-4 text-primary">
                    Preserve your memories with our beautifully crafted photo album
                </h2>
                <div className="text-center mb-4">
                    <Button variant="primary" className="me-2">See My Photos</Button>
                    <Button variant="outline-secondary">Secondary Action</Button>
                </div>

                <Row className="mt-4">
                    {/* Display existing albums */}
                    {albums.map((album) => (
                        <Col xs={6} sm={4} md={3} lg={3} key={album.id} className="mb-4 d-flex">
                            <Card
                                onClick={() => handleAlbumClick(album)}
                                className="w-100 h-100"
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    // height: '100%',  // Ensure card takes full column height
                                    display: 'flex',  // Flex for even content distribution
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',  // Add equal spacing in content
                                }}
                            >
                                <Card.Img
                                    variant="top"
                                    src={`http://localhost:3001${album.cover_image}`}
                                    alt="Album Thumbnail"
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <Card.Body className="text-center p-3">
                                    <Card.Title>{album.name}</Card.Title>
                                    {/* <Card.Text className="text-muted">
                                        This is a media card, use this for content description
                                    </Card.Text> */}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    {/* Card for creating a new album */}
                    <Col xs={6} sm={4} md={3} lg={3} className="mb-4 d-flex align-items-stretch">
                        <Card
                            className="w-100 h-100 text-center shadow-sm border-dashed d-flex flex-column justify-content-center"
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                cursor: 'pointer',
                                border: '2px dashed #888',
                                borderRadius: '15px',
                                // height: '100%',  // Match height to album cards
                                // display: 'flex',
                                // justifyContent: 'center',  // Center the "+" icon and text
                            }}
                        >
                            <Card.Body className="d-flex flex-column justify-content-center">
                                <h1 className="text-primary">+</h1>
                                <Card.Text className="text-muted">Create New Album</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


                {/* Modal for creating a new album */}
                <CreateAlbumForm
                    show={showCreateModal}
                    handleClose={() => setShowCreateModal(false)}
                    fetchAlbums={fetchAlbums}
                />

                {/* Modal for unlocking an album */}
                <Modal show={showUnlockModal} onHide={() => setShowUnlockModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Unlock Album</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            {selectedAlbumHint && (
                                <small className="text-muted mb-3 d-block">
                                    Hint: {selectedAlbumHint}
                                </small>
                            )}
                            <div className="mb-3">
                                <label className="form-label">Album Password</label>
                                <input
                                    type="password"
                                    value={unlockPassword}
                                    onChange={(e) => setUnlockPassword(e.target.value)}
                                    placeholder="Enter album password"
                                    className="form-control"
                                />
                            </div>
                        </form>

                        {errorMessage && (
                            <Alert variant="danger" className="mt-3">
                                {errorMessage}
                            </Alert>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUnlockModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleUnlockAlbum}>Unlock</Button>
                    </Modal.Footer>
                </Modal>
            </Container>

        </>
    );
};

export default Home;
