import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const CompleteConfirmModal = ({
  isOpen,
  toggle,
  onConfirm,
  message,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Confirm Action</ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={toggle}>
          Cancel
        </Button>
        <Button color="success" disabled={loading || false} onClick={onConfirm}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CompleteConfirmModal;
