import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

const CustomModal = (props) => {
  const { title, txt, handleClose, show } = props;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{txt}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CustomModal;
