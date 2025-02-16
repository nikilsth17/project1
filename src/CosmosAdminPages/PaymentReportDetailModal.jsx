// PaymentDetailModal.js

import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const PaymentDetailModal = ({ isOpen, toggle, paymentDetails }) => {
  const getFormattedAmount = (amount) => {
    return amount != null && !isNaN(amount) ? parseFloat(amount).toFixed(2) : '0.00';
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Payment Details</ModalHeader>
      <ModalBody>
        {paymentDetails && (
          <>
            <p>
              <strong>Ref Code:</strong> {paymentDetails.ref_code}
            </p>
            <p>
              <strong>Name:</strong> {paymentDetails.customer.name}
            </p>
            <p>
              <strong>Payment Type:</strong> {paymentDetails.payment_type}
            </p>
            <p>
              <strong>Payment Date:</strong>{" "}
              {new Date(paymentDetails.payment_date).toLocaleDateString()}
            </p>

            <p>
              <strong>Amount:</strong> ${getFormattedAmount(paymentDetails.amount)}
            </p>
            <p>
              <strong>GST:</strong> ${getFormattedAmount(paymentDetails.gst)}
            </p>
            <p>
              <strong>Service Fee:</strong> ${getFormattedAmount(paymentDetails.service_fee)}
            </p>
            <p>
              <strong>Total Amount:</strong> ${getFormattedAmount(paymentDetails.total_amount)}
            </p>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentDetailModal;
