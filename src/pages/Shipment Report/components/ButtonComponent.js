import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import ShipmentDeleteModal from "../ShipmentDeleteModal";
import AdminLabelDeleteModal from "./AdminLabelDeleteModal";

const ButtonComponent = ({ shipment, id, fetchShipment }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const toggleModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const [deleteAdminModalOpen, setDeleteAdminModalOpen] = useState(false);
  const toggleAdminModal = () => {
    setDeleteAdminModalOpen(!deleteAdminModalOpen);
  };

  const [buttonColor, setButtonColor] = useState();

  useEffect(() => {
    if (shipment.canBeCancelledAdminLabel) {
      setButtonColor("success");
    } else {
      setButtonColor("primary");
    }
  }, [shipment.canBeCancelledAdminLabel]);

  return (
    <Row className="">
      <Col className="text-end">
        <Button
          outline
          color="success"
          onClick={() => {
            window.open(`/customer-docs-viewer/${id}`, "_blank");
          }}
        >
          Get Customer Label
        </Button>
        {shipment.intlServiceProvider && (
          <Button
            outline
            color={buttonColor}
            onClick={() => {
              window.open(`/admin-docs-viewer/${id}`, "_blank");
            }}
            className={`ms-2   `}
          >
            {!shipment.canBeCancelledAdminLabel
              ? "Create Admin Label"
              : "Get Admin Label"}
          </Button>
        )}
        {shipment.intlServiceProvider && shipment.canBeCancelledAdminLabel && (
          <Button
            outline
            color="danger"
            onClick={toggleAdminModal}
            className="ms-2"
            // className={`ms-2 ${
            //   shipment.canBeCancelledAdminLabel && "btn btn-outline-primary"
            // }`}
            disabled={!shipment.canBeCancelledAdminLabel}
          >
            {shipment.canBeCancelledAdminLabel
              ? "Cancel Admin Label"
              : "Admin Label Cancelled"}
          </Button>
        )}
        {shipment.canBeCancelled && (
          <Button outline color="danger" onClick={toggleModal} className="ms-2">
            Cancel Shipment
          </Button>
        )}
        <Button
          outline
          color="info"
          onClick={() => {
            window.open(`/invoice-report/detail/${shipment?.invoiceId}`);
          }}
          className="ms-2 mt-sm-0 mt-2"
        >
          Invoice Detail
        </Button>
        {!shipment.isShipmentCancelled && (
          <Button
            outline
            color="primary"
            onClick={() => {
              window.open(`/shipmentedit/${shipment?.id}`);
            }}
            className="ms-2 mt-sm-0 mt-2"
          >
            Shipment Edit
          </Button>
        )}
      </Col>

      <ShipmentDeleteModal
        isOpen={deleteModalOpen}
        toggleModal={toggleModal}
        shipmentId={id}
        fetchShipment={fetchShipment}
      />

      <AdminLabelDeleteModal
        isOpen={deleteAdminModalOpen}
        toggleModal={toggleAdminModal}
        shipmentId={id}
        fetchShipment={fetchShipment}
      />
    </Row>
  );
};

export default ButtonComponent;
