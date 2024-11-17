import React from 'react';
import { Modal, Button, Row, Col, Image } from 'react-bootstrap';

const ShowPhoto = ({ albumDetails, onClose }) => {
    if (!albumDetails.photos) return null;

    return (
        <Modal show={albumDetails.photos.length > 0} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{albumDetails.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {albumDetails.photos.map((photo) => (
                        <Col md={3} key={photo.id}>
                            <Image src={`data:${photo.file_type};base64,${photo.file_data}`} thumbnail />
                        </Col>
                    ))}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>ปิด</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowPhoto;
