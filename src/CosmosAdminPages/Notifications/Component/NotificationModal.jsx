import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { formatDateTime } from "../../Appointment/Component/FormatDate";
import { capitalizeFirstLetter } from "../../../common/capitalizeFirstLetter";

const NotificationDetailModal = ({ isOpen, toggle, notification,selectedPId }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Notification Details</ModalHeader>
      <ModalBody>
<h6>{selectedPId}</h6>
        {notification ? (
          <div>
            <h6>{capitalizeFirstLetter(notification.type)}</h6>
            <p>{notification.message}</p>
            <h6 className="fs-12 text-muted mt-2">
              {formatDateTime(notification.created_at)}
            </h6>

            {/* <p>Status: {notification.is_read ? "Read" : "Unread"}</p> */}
          </div>
        ) : (
          <div>No notification details available</div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default NotificationDetailModal;
