import React, { useState,useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // ไอคอนสำหรับ toggle รหัสผ่าน

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // สถานะสำหรับการแสดง/ซ่อนรหัสผ่าน
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password,
            });

            const { token, user } = response.data;
            const user_id = user.id;

            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);

            navigate("/home");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    const handleMouseDown = () => {
        setShowPassword(true); // เมื่อกดค้าง
    };

    const handleMouseUp = () => {
        setShowPassword(false); // เมื่อปล่อย
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
      };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="p-4 shadow-sm login-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">Welcome Back</h2>
                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group controlId="formBasicEmail" className="mb-3">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="input-style"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <div className="password-input-container">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"} // สลับการแสดงรหัสผ่าน
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="input-style"
                                        />
                                        <span
                                            className="password-toggle-icon"
                                            onMouseDown={handleMouseDown}  // เมื่อกด
                                            onMouseUp={handleMouseUp}      // เมื่อปล่อย
                                            onTouchStart={handleMouseDown} // สำหรับมือถือ
                                            onTouchEnd={handleMouseUp}     // สำหรับมือถือ
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mb-2">
                                    Login
                                </Button>

                                <p className="text-center mt-3">
                                Don't have an account?{' '}
                                    <a href="/register" onClick={handleRegisterRedirect}>Register here</a>
                                </p>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
