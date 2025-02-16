import React from "react";
import { Badge, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const EmailModal = ({ modelOpen, handleModelOpen, email }) => {
  return (
    <Modal isOpen={modelOpen} toggle={handleModelOpen}>
      <ModalHeader
        toggle={handleModelOpen}
        className="bg-secondary text-white py-2"
      >
        <span className="text-white">Email</span> <span>{}</span>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md={12} className="text-center">
            <img src="/Dibya.png" style={{ maxWidth: "50%" }}></img>
          </Col>
          <Col md={6} className="">
            <p>
              <span className="fw-bold">Date: </span>
              {email.date}
            </p>
          </Col>
          <Col md={6} className="">
            <span className="fw-bold">
              Status:{" "}
              {email.status ? (
                <Badge color="success" className="fs-6">
                  Success
                </Badge>
              ) : (
                <Badge color="danger" className="fs-6">
                  Failed
                </Badge>
              )}
            </span>
          </Col>
          <Col md={6}>
            <p>
              <span className="fw-bold">From:</span> {email.from}
            </p>
          </Col>
          <Col md={6}>
            <p>
              <span className="fw-bold">To:</span> {email.to}
            </p>
          </Col>

          <p>
            {" "}
            <span className="fw-bold">Subject:</span> {email.subject}
          </p>
          <p>
            <span className="fw-bold">Message:</span> {email.message}
          </p>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default EmailModal;
