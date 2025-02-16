// src/components/ConfirmationModal.js
import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const ConfirmModal = ({ isOpen, toggle, onConfirm, loading, message }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Confirm Cancellation</ModalHeader>
      <ModalBody>
        Are you sure you want to cancel this appointment? This action cannot be
        undone.
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          No, Keep Appointment
        </Button>
        <Button color="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Cancelling..." : "Yes, Cancel Appointment"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
