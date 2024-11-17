import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Form, Button, Card, Row, Col } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const ShowAlbum = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // นำเข้า useNavigate
    const [albumData, setAlbumData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า Login ถ้าไม่ได้ล็อกอิน
            return; // หยุดการทำงานของ useEffect
        }

        const fetchAlbumData = async () => {
            try {
                const albumResponse = await axios.get(`http://localhost:3001/api/albums/get-album/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlbumData(albumResponse.data);

                // ดึงรูปภาพจาก API
                const photoResponse = await axios.post(`http://localhost:3001/api/albums/get-photos`, { album_id: id }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPhotos(photoResponse.data);
            } catch (error) {
                setErrorMessage(error.response?.data.message || 'ไม่สามารถดึงข้อมูลอัลบั้มได้');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumData();
    }, [id, navigate]); // เพิ่ม navigate ใน dependencies

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setErrorMessage('โปรดเลือกไฟล์รูปภาพ');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('album_id', id);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/albums/upload-photo', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('อัปโหลดรูปภาพสำเร็จ');
            setSelectedFile(null);
            window.location.reload(); // ทำการรีเฟรชหน้าเว็บ
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'ไม่สามารถอัปโหลดรูปภาพได้');
        }
    };

    if (loading) {
        return <div>กำลังโหลด...</div>;
    }

    return (
        <>
            <AppNavbar/>
            <Container>
                <h2>{albumData?.name}</h2> {/* แสดงชื่ออัลบั้ม */}

                {/* Card สำหรับการอัปโหลดรูปภาพ */}
                <Row className="justify-content-center mt-4">
                    <Card className="text-center shadow-sm" style={{ border: '2px dashed #888', borderRadius: '15px' }}>
                        <Card.Body>
                            <Form onSubmit={handleUpload}>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>เลือกไฟล์รูปภาพ</Form.Label>
                                    <Form.Control type="file" onChange={handleFileChange} />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    อัปโหลดรูปภาพ
                                </Button>
                            </Form>
                            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>} {/* แสดงข้อความข้อผิดพลาด */}
                        </Card.Body>
                    </Card>
                </Row>

                {/* แสดงรูปภาพที่ดึงมา */}
                <Row className="mt-4">
                    {photos.length > 0 ? (
                        photos.map((photo) => (
                            <Col key={photo.id} md={4} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={`data:${photo.file_type};base64,${photo.file_data}`} />
                                    <Card.Body>
                                        <Card.Text>{photo.file_name}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>ไม่มีรูปภาพในอัลบั้มนี้</p>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default ShowAlbum;
