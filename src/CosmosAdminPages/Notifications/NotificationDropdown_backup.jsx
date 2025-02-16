// NotificationDropdown.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Row,
  Col,
} from "reactstrap";
import {
  fetchNotifications,
  markNotificationAsRead,
  clearAllNotifications,
} from "../../slices/notification/action"; // Update the import path as necessary
import SimpleBar from "simplebar-react";
import { formatDateTime } from "../Appointment/Component/FormatDate";
import NotificationDetailModal from "./Component/NotificationModal";
import { capitalizeFirstLetter } from "../../common/capitalizeFirstLetter";

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const [isNotificationDropdown, setIsNotificationDropdown] =
    React.useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState(null);

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdown(!isNotificationDropdown);
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    dispatch(markNotificationAsRead(notification.id));
    if (notification.link) {
      window.location.href = notification.link; // Navigate directly
    }
  };

  const handleClearAllNotifications = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.user?.id;
    if (userId) {
      dispatch(clearAllNotifications(userId));
    }
  };

  const fetchAndSetNotifications = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.user?.id;
    if (userId) {
      dispatch(fetchNotifications(userId));
    }
  };

  useEffect(() => {
    // Fetch notifications on component mount
    fetchAndSetNotifications();

    // Set up interval to fetch notifications every 10 seconds
    const intervalId = setInterval(fetchAndSetNotifications, 10000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="pt-2">
        <Dropdown
          isOpen={isNotificationDropdown}
          toggle={toggleNotificationDropdown}
          className="topbar-head-dropdown ms-1 header-item"
        >
          <DropdownToggle
            type="button"
            className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
            title="Notification"
          >
            <i className="bx bx-bell fs-20"></i>
            {notifications.some((notification) => !notification.is_read) && (
              <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                {
                  notifications.filter((notification) => !notification.is_read)
                    .length
                }
              </span>
            )}
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
            <div className="dropdown-head bg-primary bg-pattern rounded-top">
              <div className="p-3">
                <Row className="align-items-center">
                  <Col>
                    <h6 className="m-0 fs-18 fw-semibold text-white">
                      Notifications
                    </h6>
                  </Col>
                  <Col className="text-end">
                    <Button
                      size="sm"
                      color="light"
                      onClick={handleClearAllNotifications}
                    >
                      Clear All
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
            <SimpleBar style={{ maxHeight: "300px" }}>
              <div
                style={{
                  maxHeight: "300px",
                  minHeight: "250px",
                  overflowY: "auto",
                }}
              >
                {notifications.length > 0 ? (
                  notifications
                    .slice()
                    //.reverse()
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-bottom ${
                          notification.is_read ? "bg-white" : "bg-light"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="d-flex justify-content-between mt-1">
                          <h6 className="mb-1">
                            {capitalizeFirstLetter(notification.type)}
                          </h6>
                          {notification.link && <span>Go to page</span>}
                        </div>
                        <p className="mb-0 text-muted">
                          {notification.message}
                        </p>
                        <h6 className="fs-10 text-muted mt-2">
                          {formatDateTime(notification.created_at)}
                        </h6>
                      </div>
                    ))
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "300px" }}
                  >
                    <div className="text-center">No notifications</div>
                  </div>
                )}
              </div>
            </SimpleBar>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        isOpen={isNotificationModalOpen}
        toggle={toggleNotificationModal}
        notification={selectedNotification}
      />
    </React.Fragment>
  );
};

export default NotificationDropdown;
