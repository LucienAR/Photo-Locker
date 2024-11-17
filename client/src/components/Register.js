import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import './Register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false); // State เดียวสำหรับแสดงรหัสผ่านทั้งสองช่อง
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length > 20) {
      setPasswordError('Password cannot be more than 20 characters.');
      return;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one special character.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', { email, password });
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleMouseDown = () => {
    setShowPasswords(true);
  };

  const handleMouseUp = () => {
    setShowPasswords(false);
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm login-card">
            <Card.Body>
              <h2 className="text-center mb-4">Register</h2>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {passwordError && <Alert variant="danger">{passwordError}</Alert>}
              <Form onSubmit={handleRegister}>
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
                      type={showPasswords ? "text" : "password"} // ใช้ state เดียวในการแสดง/ซ่อน
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      maxLength={20}
                      required
                      className="input-style"
                    />
                    {/* เพิ่มไอคอน toggle สำหรับเปิด/ปิดรหัสผ่าน */}
                    <span
                      className="password-toggle-icon"
                      onMouseDown={handleMouseDown} // ใช้ onMouseDown แทน
                      onMouseUp={handleMouseUp} // ใช้ onMouseUp แทน
                      onTouchStart={handleMouseDown} // รองรับการสัมผัสบนอุปกรณ์มือถือ
                      onTouchEnd={handleMouseUp}
                    >
                      {showPasswords ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="password-input-container">
                    <Form.Control
                      type={showPasswords ? "text" : "password"} // ใช้ state เดียวกันในการแสดง/ซ่อน
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="input-style"
                    />
                    {/* เพิ่มไอคอน toggle สำหรับเปิด/ปิดรหัสผ่าน */}
                    <span
                      className="password-toggle-icon"
                      onMouseDown={handleMouseDown} // ใช้ onMouseDown แทน
                      onMouseUp={handleMouseUp} // ใช้ onMouseUp แทน
                      onTouchStart={handleMouseDown} // รองรับการสัมผัสบนอุปกรณ์มือถือ
                      onTouchEnd={handleMouseUp}
                    >
                      {showPasswords ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-2">
                  Register
                </Button>
              </Form>

              <p className="text-center mt-3">
                Already have an account?{' '}
                <a href="/" onClick={handleLoginRedirect}>Login here</a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
