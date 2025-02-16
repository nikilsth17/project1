import React, { useState, useEffect } from "react";
import { NameInitialsAvatar } from "react-name-initials-avatar";
import { Button, Card, Col, Row } from "reactstrap";
import OrderServices from "../../../services/DibyaServices/OrderServices/OrderServices";
import { toast } from "react-toastify"; // Ensure you have this imported if using toast notifications

const formatNepaliNumber = (amount) => {
  if (amount === null || amount === undefined) return '';

  const parts = amount.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  let formatted = '';
  let length = integerPart.length;

  // Handle the first three digits
  if (length > 3) {
    const firstThreeDigits = integerPart.slice(0, length - 3);
    const lastThreeDigits = integerPart.slice(length - 3);

    let remainingDigits = firstThreeDigits;
    while (remainingDigits.length > 2) {
      formatted = ',' + remainingDigits.slice(-2) + formatted;
      remainingDigits = remainingDigits.slice(0, -2);
    }
    formatted = remainingDigits + formatted + ',' + lastThreeDigits;
  } else {
    formatted = integerPart;
  }

  return `${formatted}.${decimalPart}`;
};

const Details = ({ orderDetail, orderId, onClose, onStatusUpdate, setOrder }) => {
  const receivedOptions = [
    { label: "Processing", value: 3 },
    { label: "Ready", value: 4 },
    { label: "Delivering", value: 5 },
    { label: "Cancelled", value: 6 },
    { label: "Completed", value: 7 }
  ];

  const [receiveDropdownOpen, setReceiveDropdownOpen] = useState(false);
  const [paidDropdownOpen, setPaidDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(orderDetail?.paymentDetail?.status || "Unpaid");

  useEffect(() => {
    if (orderDetail?.paymentDetail?.status) {
      setPaymentStatus(orderDetail.paymentDetail.status);
    }
  }, [orderDetail?.paymentDetail?.status]);

  const toggleReceiveDropdown = () => {
    setReceiveDropdownOpen(!receiveDropdownOpen);
  };

  const togglePaidDropdown = () => {
    setPaidDropdownOpen(!paidDropdownOpen);
  };

  const handleStatusChange = async (status) => {
    try {
      await OrderServices.updateOrder(orderId, status.value);
      toast.success("Status updated successfully");
      setSelectedStatus(status.label);  // Update the button label
      setReceiveDropdownOpen(false);  // Close the dropdown
      onClose();
      onStatusUpdate(status);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handlePaymentStatusChange = async () => {
    try {
      await OrderServices.updatePaymentStatus(orderId);
      const newStatus = paymentStatus === "Paid" ? "Unpaid" : "Paid";
      setPaymentStatus(newStatus);
      toast.success("Payment status updated successfully");
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const buttonLabel = selectedStatus || orderDetail?.orderDetails[0]?.status;

  return (
    <>
      <h2 className="d-none d-print-block" style={{ marginTop: '20px' }}>Order Information:</h2>
      <Row className="mb-4 d-none d-print-block" style={{ marginLeft: '4px' }}>
        <Col style={{ width: '60%' }}>
          <Row>
            <Col><h6 className="fs-15 fw-bold">Customer Name:</h6></Col>
            <Col><h6 className="fs-15 fw-bold">{orderDetail?.userDetail?.fullName}</h6></Col>
          </Row>
          {orderDetail?.email && (
            <Row>
              <Col><h6 className="fs-15 fw-bold">Email:</h6></Col>
              <Col><h6 className="fs-15 fw-bold">{orderDetail?.email}</h6></Col>
            </Row>
          )}
          <Row>
            <Col><h6 className="fs-15 fw-bold">Address:</h6></Col>
            <Col><h6 className="fs-15 fw-bold">{orderDetail?.userDetail?.address}</h6></Col>
          </Row>
          <Row>
            <Col><h6 className="fs-15 fw-bold">Phone Number:</h6></Col>
            <Col><h6 className="fs-15 fw-bold">{orderDetail?.userDetail?.phoneNumber}</h6></Col>
          </Row>
          {orderDetail?.userDetail?.addressInstruction && (
            <Row>
              <Col><h6 className="fs-15 fw-bold">Address Instruction:</h6></Col>
              <Col><h6 className="fs-15 fw-bold">{orderDetail?.userDetail?.addressInstruction}</h6></Col>
            </Row>
          )}
          <Row>
            <Col><h6 className="fs-15 fw-bold">Refrence Number:</h6></Col>
            <Col><h6 className="fs-15 fw-bold">{orderDetail?.orderDetails[0]?.orderRef}</h6></Col>
          </Row>
          <Row>
            <Col><h6 className="fs-15 fw-bold">Payment Status:</h6></Col>
            <Col><h6 className="fs-15 fw-bold">{paymentStatus}</h6></Col>
          </Row>
        </Col>
      </Row>


      <Row className="mb-4 d-print-none">
        <Col xs={5} md={5} lg={2} className="d-print-none text-center">
          <div className="mt-2">
            <NameInitialsAvatar
              name={`${orderDetail?.userDetail?.fullName} `}
              textSize="40px"
              size={"120px"}
              bgColor="#D6DAC8"
              borderColor="#D6DAC8"
            />
          </div>
        </Col>
        <Col xs={7} md={6} lg={3}>
          <Row>
            <Col xs={10} md={8} lg={8} className="col-6 pb-4 mt-4">
              <h5 className="fs-18 fw-bold">
                {orderDetail?.userDetail?.fullName}
              </h5>
              <h6 className="fs-15 fw-bold">{orderDetail?.email}</h6>
              <h6 className="fs-15 fw-bold">
                {orderDetail?.userDetail?.address}
              </h6>
              <h6 className="fs-15 fw-bold">
                {orderDetail?.userDetail?.phoneNumber}
              </h6>
              <h6 className="fs-15 fw-bold">
                {orderDetail?.userDetail?.addressInstruction}
              </h6>
            </Col>
          </Row>
        </Col>
        <Col md={5} lg={3}>
          <h5 className="mt-4">Order Details</h5>
          <h6 className="fs-16 fw-bold text-muted">
            Ref No.:
            <br />
            {orderDetail?.orderDetails[0]?.orderRef}
          </h6>

          <h6 className="fs-16 fw-bold text-muted">
            Order Amount: Rs. {formatNepaliNumber(orderDetail?.totalPrice)}
          </h6>

          <div className="btn-group d-print-block">
            <button
              type="button"
              className="btn btn-success text-start"
              //onClick={handleButtonClick}  // Add onClick event here
              style={{ width: "100px" }}>
              {buttonLabel}
            </button>
            <button
              type="button"
              className="btn btn-success dropdown-toggle dropdown-toggle-split"
              onClick={toggleReceiveDropdown}
            >
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
          </div>
          {receiveDropdownOpen && (
            <ul className="dropdown-menu show">
              {receivedOptions?.map((item, index) => (
                <li key={index}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => handleStatusChange(item)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Col>
        <Col md={5} lg={3}>
          {orderDetail?.paymentDetail?.ref_No && (
            <>
              <h5 className="mt-4">Payment Details</h5>
              <h6 className="fs-16 fw-bold text-muted">
                Ref No.:
                <br />
                {orderDetail.paymentDetail?.ref_No}
              </h6>
            </>
          )}
          {orderDetail?.paymentDetail?.txnDateTime && (
            <h6 className="fs-16 fw-bold text-muted">
              Txn Date: {orderDetail?.paymentDetail?.txnDateTime.split("T")[0]}
            </h6>
          )}

          {orderDetail?.paymentDetail?.paymentType && (
            <h6 className="fs-16 fw-bold text-muted">
              Payment Type: {orderDetail.paymentDetail.paymentType}
            </h6>
          )}

          <div className="d-flex gap-3">
            <div>
              {orderDetail?.paymentDetail?.status && (
                <div className="btn-group">
                  <button
                    type="button"
                    className={`btn ${paymentStatus === "Paid" ? "btn-success" : "btn-danger"} text-start`}
                    style={{ width: "80px" }}
                    onClick={handlePaymentStatusChange}
                  >
                    {paymentStatus}
                  </button>
                </div>
              )}
              {paidDropdownOpen && (
                <ul className="dropdown-menu show">
                  <li>
                    <a className="dropdown-item" href="#">
                      Paid
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Unpaid
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Details;