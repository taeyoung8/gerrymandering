import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const PhotoModal = ({ repName, repPhotoUrl, setShowPhotoModal }) => {
  return (
    <div className='modal show' style={{ display: 'block', position: 'initial', height: '75vh' }}>
      <Modal.Dialog>
        <Modal.Header closeButton onHide={() => setShowPhotoModal(false)}>
          <Modal.Title>{repName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={repPhotoUrl} alt={repName} style={{ height: '300px' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => setShowPhotoModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default PhotoModal;
