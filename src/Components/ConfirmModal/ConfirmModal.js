// src/components/ConfirmationModal.js
import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const ConfirmModal = ({
  isConfirmModalOpen,
  toggleConfirm,
  handleStatusChange,
  loading,
}) => {
  return (
    <Modal isOpen={isConfirmModalOpen} toggle={toggleConfirm}>
      <ModalHeader toggle={toggleConfirm}>Confirm Appointment</ModalHeader>
      <ModalBody>Are you sure you want to confirm this appointment?</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={toggleConfirm}>
          Cancel
        </Button>
        <Button color="success" onClick={handleStatusChange} disabled={loading}>
          {loading ? "Confirming..." : "Confirm"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
