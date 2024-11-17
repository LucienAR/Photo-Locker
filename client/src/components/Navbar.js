// Navbar.js
import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/'); // Redirect to login page after successful logout
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="p-3">
            <Navbar.Brand href="/home" className="text-white">
                <i className="bi bi-camera-fill me-2"></i> Photo Locker
            </Navbar.Brand>
            <Nav className="ms-auto">
                <Button variant="light" onClick={handleLogout}>
                    Logout
                </Button>
            </Nav>
        </Navbar>
    );
};

export default AppNavbar;
