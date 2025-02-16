import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import TimeExtendModal from "../../Appointment/Component/TimeExtendModal";
import CalendarModal from "../../Calendar/Component/CalendarModal";
import PaymentStatusModal from "../../Appointment/Component/PaymentStatusModal";
import CompleteConfirmModal from "../../Appointment/Component/CompleteConfirmModal";
import ConfirmModal from "../../Appointment/Component/ConfirmMOdal";
import RescheduleModal from "../../Appointment/Component/RescheduleModal";
import CustomerServices from "../../../services/CustomerServices/CustomerServices";
import { formatDateTime } from "../../Appointment/Component/FormatDate";
import { formatDateTimes } from "../../../Components/Common/FormatDate";

const DriverRightOffCanvas = ({
  isRight,
  toggleRightCanvas,
  event,
  setEvent,
  toggle,
  isEdit,
  onStatusChange,
}) => {
  console.log("event", event);

  useEffect(() => {
    setEvent(event); // Update the state when the event prop changes
  }, [event, setEvent]); // Ensure setEvent is included in the dependency array

  const [selectedAppointmentStatus, setSelectedAppointmentStatus] =
    useState("");

  const [dataList, setDataList] = useState({});
  console.log("dataList", dataList);

  const [receiveDropdownOpen, setReceiveDropdownOpen] = useState(false);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isStatusChangeConfirmOpen, setIsStatusChangeConfirmOpen] =
    useState(false);
  const [isStatusCompleteConfirmOpen, setIsStatusCompleteConfirmOpen] =
    useState(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedSessionTime, setSelectedSessionTime] = useState(null);
  console.log("selectedSessionTime", selectedSessionTime);
  const [selectedTime, setSelectedTime] = useState("");

  const [statusToChange, setStatusToChange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false); // State to track completion
  console.log("isCompleted", isCompleted);

  const [isCancelled, setIsCancelled] = useState(false); // State to track completion
  console.log("🚀 ~ isCancelled:", isCancelled);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const statusColors = {
    CONFIRMED: "bg-success",
    PENDING: "bg-warning",
    CANCELLED: "bg-danger",
  };

  const paymentStatusColors = {
    PAID: "bg-success",
    PENDING: "bg-warning",
  };

  const appointmentStatusColors = {
    CANCELLED: "bg-danger",
    CONFIRMED: "bg-success",
    SCHEDULED: "bg-secondary",
  };

  const appointmentButtonClass =
    statusColors[selectedAppointmentStatus] || "bg-secondary";
  const paymentButtonClass =
    paymentStatusColors[selectedPaymentStatus] || "bg-secondary";

  const receivedOptions = [
    { label: "CONFIRMED" },
    { label: "PENDING" },
    { label: "CANCELLED" },
  ];

  const paymentOptions = [{ label: "PAID" }, { label: "PENDING" }];

  const toggleReceiveDropdown = () => {
    setReceiveDropdownOpen(!receiveDropdownOpen);
  };

  const togglePaymentModal = () => {
    setIsPaymentModalOpen(!isPaymentModalOpen);
  };

  const togglePaymentDropdown = () => {
    setPaymentDropdownOpen(!paymentDropdownOpen);
  };

  const toggleRescheduleModal = () => {
    setIsRescheduleModalOpen(!isRescheduleModalOpen);
  };

  const handleCompleteModal = () => {
    console.log("Opening modal...");
    setIsStatusCompleteConfirmOpen(true);
  };

  const toggleCompleteModal = () => {
    console.log("Toggling modal...");
    setIsStatusCompleteConfirmOpen(!isStatusCompleteConfirmOpen);
  };

  const fetchAppointmentDetails = async () => {
    console.log("event", event);
    try {
      const response = await AppointmentService.detail(event?.appointment?.id);
      console.log("apponintmentresopones", response);
      const res = await CustomerServices.getCustomerDetail(
        event?.appointment?.customer_id
      );
      console.log(res, "RESPONSE");
      setDataList(response.data);
      setSelectedAppointmentStatus(response.data?.appointment_status);
      setSelectedPaymentStatus(response.data.payment_status);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  useEffect(() => {
    if (event?.id) {
      fetchAppointmentDetails();
    }
  }, [event?.id]);

  const handleStatusChange = (status) => {
    setStatusToChange(status.label);
    setIsStatusChangeConfirmOpen(true);
    setReceiveDropdownOpen(false);
  };

  const confirmStatusChange = async () => {
    try {
      const payload = {
        appointment_id: event?.appointment.id,
        appointment_status: statusToChange,
      };

      await AppointmentService.updateStatus(event?.appointment?.id, payload);
      toast.success("Appointment status is changed to " + statusToChange);
      setSelectedAppointmentStatus(statusToChange);
      onStatusChange();
      setIsStatusChangeConfirmOpen(false);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status.");
    }
  };

  const handlePaymentStatusChange = () => {
    // setSelectedPaymentStatus(status.label);
    setIsPaymentModalOpen(true);
    setPaymentDropdownOpen(false);
  };

  const confirmPaymentStatusChange = async (inputData) => {
    try {
      const payload = {
        appointment_id: event?.appointment?.id,
        // payment_status: selectedPaymentStatus,
        ref_code: inputData.referenceNo,
        remarks: inputData.remarks,
        amount: inputData.amount,
        payment_type: inputData.payment_type,
        discount_amount: inputData.discount_amount,
        tip: inputData.tip,
      };

      await AppointmentService.updatePaymentStatus(
        event?.appointment?.id,
        payload
      );
      toast.success("Payment is done successfully.");
      // setSelectedPaymentStatus(selectedPaymentStatus);
      fetchAppointmentDetails();
      onStatusChange();
      toggleRightCanvas();
      setIsPaymentModalOpen(false); // Close modal after confirmation
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status.");
    }
  };

  // const handleComplete = async () => {
  //   setLoading(true); // Start loading

  //   try {
  //     const response = await AppointmentService.complete(event.id);
  //     console.log("responsttt", response);
  //     toast.success("Completed Successfull.");
  //     setIsCompleted(true); // Set completion state
  //     onStatusChange();
  //     console.log("calendar refresh");

  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to complete appointment");
  //   }
  // };

  const handleComplete = async () => {
    setLoading(true); // Start loading

    try {
      // Mark the appointment as complete
      const response = await AppointmentService.complete(event.id);
      console.log("responsttt", response);
      toast.success("Completed Successfull.");
      setIsCompleted(true);
      // Fetch updated appointment details
      const updatedDetails = await AppointmentService.detail(
        event?.appointment?.id
      );
      setEvent((prevEvent) => ({
        ...prevEvent,
        appointment: updatedDetails.data,
        status: "COMPLETED", // Ensure the status reflects the change
      }));

      // Trigger parent component updates or calendar refresh
      onStatusChange();
      toggleCompleteModal();
      console.log("Event updated and calendar refreshed.", event);
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // const handleConfirm = (sessionId, sessionTime) => {
  //   setSelectedSessionId(sessionId);
  //   setSelectedSessionTime(sessionTime);
  //   setIsModalConfirmOpen(true);
  // };

  const handleReschedule = (sessionId, sessionTime) => {
    setSelectedSessionId(sessionId);
    setSelectedSessionTime(sessionTime);
    setIsRescheduleModalOpen(true);
  };
  // const confirmAction = async () => {
  //   console.log("Confirmed session ID:", selectedSessionId);
  //   setIsModalConfirmOpen(false);
  //   toast.success("Session confirmed!");
  // };

  const rescheduleAction = () => {
    // Logic to reschedule session using selectedSessionId
    console.log("Reschedule confirmed for session:", selectedSessionId);
    toggleRescheduleModal(); // Close the modal after rescheduling
  };

  const handleTimeChange = (sessionId, initialTime) => {
    setSelectedSessionId(sessionId);
    setSelectedTime(initialTime);
    setIsTimeOpen(true);
  };

  const handleTimeExtended = (sessionId, newTime, action = "extend") => {
    const newStartTime = new Date(event.start);
    if (action == "extend") {
      newStartTime.setMinutes(
        newStartTime.getMinutes() + parseInt(newTime, 10)
      );
    } else {
      newStartTime.setMinutes(
        newStartTime.getMinutes() - parseInt(newTime, 10)
      );
    }
    // Update event state with new time
    setEvent((prevEvent) => ({
      ...prevEvent,
      start: newStartTime, // Update start time
    }));
    fetchAppointmentDetails();
    // Optionally, call the parent's update function to reflect changes in the calendar
    onStatusChange(); // Assuming onStatusChange triggers the calendar refresh
  };

  const toggleModal = () => {
    setIsTimeOpen((prev) => !prev);
    if (isTimeOpen) {
      setSelectedSessionId(null);
      setSelectedTime(null); // Reset if necessary
    }
  };

  // const handleCancelledAppointment = async () => {
  //   setCancelLoading(true); // Start loading
  //   const payload = {
  //     appointment_id: event?.appointment?.id,
  //     appointment_status: "CANCELLED",
  //   };
  //   try {
  //     const response = await AppointmentService.updateStatus(
  //       event?.appointment?.id,
  //       payload
  //     );
  //     const updatedDetails = await AppointmentService.detail(
  //       event?.appointment?.id
  //     );
  //     setEvent((prevEvent) => ({
  //       ...prevEvent,
  //       appointment: updatedDetails.data,
  //       status: "CANCELLED", // Ensure the status reflects the change
  //     }));

  //     toast.success("Cancelled Successfully.");
  //     // Trigger parent component updates or calendar refresh
  //     onStatusChange();
  //     toggleCancelledModal(); // Close modal after successful cancellation
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to cancel appointment");
  //   } finally {
  //     setCancelLoading(false); // Stop loading
  //   }
  // };

  // const handleCancelledAppointment = async () => {
  //   setLoading(true); // Set loading to true when cancellation starts

  //   try {
  //     const payload = {
  //       appointment_id: event?.appointment?.id,
  //       appointment_status: "CANCELLED",
  //     };

  //     await AppointmentService.delete(event?.appointment?.id);
  //     toast.success("Appointment has been cancelled.");
  //     toggleCancelledModal();
  //     onStatusChange();
  //     toggleRightCanvas();
  //   } catch (error) {
  //     console.log("Error cancelling appointment:", error.message);
  //     toast.error("Failed to cancel appointment.");
  //   }

  //   setLoading(false); // Set loading to false when cancellation finishes
  // };
  const toggleCancelledModal = () => {
    setIsCancelled(!isCancelled);
  };

  const handleCancelled = async (id) => {
    setCancelLoading(true); // Start loading
    const payload = {
      appointment_id: event?.appointment?.id,
      appointment_status: "CANCELLED",
    };
    try {
      const response = await AppointmentService.updateStatus(
        event?.appointment?.id,
        payload
      );

      toast.success("Cancelled Successfull.");
      // Trigger parent component updates or calendar refresh
      toggleCancelledModal();
      toggleRightCanvas();
      onStatusChange();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancelled appointment");
    }
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const sendTextMessage = () => {
    window.open(
      `sms:+61 ${event?.appointment?.customer?.phone_number}`,
      "_blank"
    );
  };

  const callNumber = () => {
    window.open(
      `tel: =+61 ${event?.appointment?.customer?.phone_number}`,
      "_blank"
    );
  };

  const copyNumber = () => {
    const phoneNumber = event?.appointment?.customer?.phone_number;
    if (!phoneNumber) {
      console.error("Phone number is undefined");
      return;
    }

    navigator.clipboard
      .writeText(phoneNumber)
      .then(() => {
        toast.success("Phone number copied to clipboard.");
      })
      .catch((error) => {
        console.error("Copy failed:", error);
      });
  };
  return (
    <Offcanvas
      isOpen={isRight}
      direction="end"
      toggle={toggleRightCanvas}
      className="border-bottom"
    >
      <OffcanvasHeader toggle={toggleRightCanvas}>
        Appointment Details
      </OffcanvasHeader>
      <OffcanvasBody className="p-0 overflow-y-auto">
        <SimpleBar style={{ height: "100vh" }}>
          <div className="ms-4 activity-timeline p-2">
            <div className="d-flex justify-content-between align-items-center border-bottom py-2">
              <Link
                to={`/customer/detail/${dataList?.customer?.id}`}
                className="text-decoration-none"
              >
                <h5 className="mb-0 d-flex justify-content-center align-content-center align-items-center">
                  {event?.payment_status === 1 ? (
                    <i
                      className={event?.icon}
                      style={{
                        fontSize: "18px",
                        fontWeight: "normal",
                        color: "green",
                      }}
                    ></i>
                  ) : null}
                  {event?.fullName}
                </h5>
              </Link>
              <div className="d-flex gap-3">
                <Button
                  className={`btn-sm text-dark ${
                    isCompleted || event?.status === "COMPLETED"
                      ? "btn-success"
                      : // : event?.status === "SCHEDULED"
                        "btn-warning"
                    // : "btn-secondary" // This would be for 'CONFIRMED'
                  }`}
                  onClick={handleCompleteModal}
                  disabled={
                    loading ||
                    isCompleted ||
                    selectedAppointmentStatus === "CANCELLED" ||
                    event?.status === "COMPLETED"
                  } // Disable if loading or already completed
                >
                  {isCompleted || event?.status === "COMPLETED"
                    ? "COMPLETED"
                    : loading
                    ? "Processing..."
                    : " Mark as Complete"}
                </Button>
              </div>
            </div>

            <div className="activity-item border-bottom py-2">
              <div className="d-flex flex-column">
                <h6 className="fs-14 d-flex justify-content-start align-content-start align-items-start gap-2">
                  <i class="ri-phone-line"></i> Mobile Number:{" "}
                  {/* <a
                    href={`tel:+61${event?.appointment?.customer?.phone_number}`}
                  >
                    +61 {event?.appointment?.customer?.phone_number}
                  </a> */}
                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle tag="a" className="cursor-pointer">
                      +61 {event?.appointment?.customer?.phone_number}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={sendTextMessage}>
                        Send a Text Message
                      </DropdownItem>
                      <DropdownItem onClick={callNumber}>Call</DropdownItem>
                      <DropdownItem onClick={copyNumber}>Copy</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </h6>

                {/* <h6 className="fs-14 mt-1">
                  {" "}
                  <a
                    href={`https://www.google.com/maps/search/?q=${encodeURIComponent(
                      event?.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event?.location}
                  </a>
                </h6> */}
                <h6 className="fs-14 mt-1 d-flex justify-content-start align-content-start align-items-start gap-2">
                  <i class="ri-map-pin-line"></i>{" "}
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      event?.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event?.location}
                  </a>
                </h6>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fs-14 d-flex justify-content-start align-content-start align-items-start gap-2">
                    <i class="ri-time-line"></i> Appointment Time:{" "}
                    <span className="fw-semibold">
                      {event
                        ? new Date(event.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "No appointment time set"}
                    </span>
                  </h6>
                  {event?.status !== "COMPLETED" ? (
                    <button
                      id="time"
                      className="btn btn-sm text-dark btn-warning d-flex align-items-center"
                      onClick={() => handleTimeChange(event.id, event.start)}
                      disabled={selectedAppointmentStatus === "CANCELLED"}
                    >
                      <i className="bx bx-edit-alt me-1"></i>

                      <UncontrolledTooltip placement="left" target="time">
                        Extend time
                      </UncontrolledTooltip>
                    </button>
                  ) : null}
                </div>
                <h6 className="mb-0 fs-14 d-flex justify-content-start align-content-start align-items-start gap-2">
                  <i class="ri-time-line"></i> End Time:{" "}
                  <span className="fw-semibold">
                    {event
                      ? new Date(event.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No appointment time set"}
                  </span>
                </h6>
                <h6 className="fs-14 mt-2 d-flex justify-content-start align-content-start align-items-start gap-2">
                  {" "}
                  <i class="ri-calendar-line"></i> {event?.datetag}
                </h6>
                <h6 className="fs-14 d-flex justify-content-start align-content-start align-items-start gap-2">
                  {" "}
                  <i class="bx bx-package"></i> {event?.description}
                </h6>

                <h6 className="fs-14 d-flex justify-content-start align-content-start align-items-start gap-2">
                  <i class="ri-time-line"></i> Duration:{" "}
                  <span className="fw-bold">
                    {event?.appointment?.session_duration} hour
                  </span>
                </h6>
              </div>
            </div>

            <Row className="mt-2 border-bottom py-2">
              <Col lg={12} className="mb-1">
                <h6 className="fs-14">
                  Appointment Status:{" "}
                  <Badge
                    className={
                      appointmentStatusColors[selectedAppointmentStatus]
                    } // Dynamically set the class
                  >
                    {selectedAppointmentStatus}
                  </Badge>
                </h6>

                <h6 className="fs-14">
                  Amount: AUD {dataList?.session_price || ""}
                </h6>
                <h6 className="fs-14">
                  Payment Type: {dataList?.payment_type?.title || ""}
                </h6>
                {/* <h6 className="fs-14">
                  Payment Date:{" "}
                  {formatDateTimes(
                    dataList?.payments?.[dataList.payments.length - 1]
                      ?.payment_date || ""
                  )}
                </h6> */}
                <h6 className="fs-14">
                  Payment Date:{" "}
                  {dataList?.payments?.length
                    ? formatDateTimes(
                        dataList.payments[dataList.payments.length - 1]
                          ?.payment_date || ""
                      )
                    : ""}
                </h6>

                {/* <div className="btn-group" onClick={toggleReceiveDropdown}>
                  <button
                    type="button"
                    className={`btn ${appointmentButtonClass} text-start`}
                  >
                    {selectedAppointmentStatus}
                  </button>
                  <button
                    type="button"
                    className={`btn ${appointmentButtonClass} dropdown-toggle`}
                  >
                    <span className="visually-hidden">Toggle Dropdown</span>
                  </button>
                </div>
                {receiveDropdownOpen && (
                  <ul className="dropdown-menu show">
                    {receivedOptions.map((item, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          onClick={() => handleStatusChange(item)}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )} */}
              </Col>
              <Col lg={12} className="">
                <h6 className="fs-14">
                  Payment Status:{" "}
                  <span>
                    {event?.payment_status === 1 ? "PAID" : "PENDING"}
                  </span>
                  {/* <Badge
                    className={paymentStatusColors[selectedPaymentStatus]} // Dynamically set the class
                  >
                    {selectedPaymentStatus}
                  </Badge> */}
                </h6>
              </Col>
              <Col lg={12} className="">
                {/* <button
                  type="button"
                  className={`btn ${paymentButtonClass} text-start`}
                >
                  {selectedPaymentStatus}
                </button> */}

                {selectedPaymentStatus === "PAID" ||
                (dataList?.payment_type?.title === "Cash" &&
                  dataList.sessions?.length > 0 &&
                  dataList.sessions.every(
                    (session) => session.payment_status === 1
                  )) ? null : (
                  <button
                    type="button"
                    // className={`btn ${paymentButtonClass}`}
                    className="btn btn-primary"
                    onClick={() => handlePaymentStatusChange()}
                    disabled={selectedAppointmentStatus === "CANCELLED"}
                  >
                    <span>Receive Payment</span>
                  </button>
                )}
              </Col>
              {/* <Col lg={6} className="mt-2">
                <h6 className="fs-16">Payment Status</h6>
                <div className="btn-group" onClick={togglePaymentDropdown}>
                  <button
                    type="button"
                    className={`btn ${paymentButtonClass} text-start`}
                  >
                    {selectedPaymentStatus}
                  </button>
                  <button
                    type="button"
                    className={`btn ${paymentButtonClass} dropdown-toggle`}
                  >
                    <span className="visually-hidden">Toggle Dropdown</span>
                  </button>
                </div>
                {paymentDropdownOpen && (
                  <ul className="dropdown-menu show">
                    {paymentOptions.map((item, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          onClick={() => handlePaymentStatusChange(item)}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Col> */}
              {/* <Col>
                <button
                  className="btn btn-primary  w-100 mt-2 mb-2"
                  id="btn-new-event"
                  // onClick={toggle}
                  onClick={toggle}
                >
                  <i className="mdi mdi-plus"></i>
                  {isEdit ? "Edit Booking" : "Create New Booking"}
                </button>{" "} */}
              {/* {isEdit && (
                  <button
                    className="btn btn-primary w-100"
                    id="btn-new-event"
                    onClick={toggle}
                  >
                    Edit Booking
                  </button>
                )} */}
              {/* </Col> */}
            </Row>

            {event?.status !== "COMPLETED" ? (
              <Row className="mt-4 mb-3">
                <div className="d-flex justify-content-between mb-3">
                  <h5>Scheduled Detail:</h5>

                  {dataList.sessions?.length === 1 ? (
                    <Button
                      onClick={handleReschedule}
                      id="tooltipLeft"
                      className="btn-warning text-dark"
                      size="sm"
                      disabled={
                        dataList.sessions?.every(
                          (session) => new Date(session.start_time) < new Date()
                        ) || selectedAppointmentStatus === "CANCELLED"
                      } // Disable if all sessions are in the past
                    >
                      <i className="bx bx-reset"></i>
                      <UncontrolledTooltip
                        placement="left"
                        target="tooltipLeft"
                      >
                        Reschedule
                      </UncontrolledTooltip>
                    </Button>
                  ) : null}
                </div>

                {dataList.sessions?.length > 0 ? (
                  dataList.sessions?.map((session, index) => {
                    const isPast = new Date(session.start_time) < new Date();
                    const isHighlighted =
                      formatDateTime(event.start) ===
                      formatDateTime(session.start_time);
                    return (
                      <div key={index} className="border-bottom">
                        <Row className="d-flex justify-content-between align-items-center">
                          <Col
                            md={10}
                            className="py-1 d-flex justify-content-between"
                          >
                            <h6
                              className={`fs-14 d-flex justify-content-center align-content-center align-items-center gap-2 ${
                                isPast ? "text-muted" : ""
                              } ${isHighlighted ? "text-warning" : ""}`}
                            >
                              {index + 1}. {formatDateTime(session.start_time)}
                              {session?.payment_status === 1 ? (
                                <i
                                  class="bx bx-dollar "
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "normal",
                                    color: "green",
                                  }}
                                ></i>
                              ) : (
                                ""
                              )}
                            </h6>
                          </Col>
                        </Row>
                      </div>
                    );
                  })
                ) : (
                  <p>No sessions scheduled.</p>
                )}
              </Row>
            ) : null}
            {dataList.package?.package_type === "PER-HOUR" ||
            (dataList.package?.package_type === "DRIVING-TEST" &&
              dataList.sessions?.length > 0 &&
              dataList.sessions.every(
                (session) =>
                  session.payment_status !== 1 && session.status !== "COMPLETED"
              )) ? (
              <Button
                className={`btn-sm ${
                  event?.status === "CANCELLED"
                    ? "btn-danger"
                    : event?.status === "SCHEDULED"
                    ? "btn-danger"
                    : "btn-danger" // This would be for 'CONFIRMED'
                }`}
                onClick={toggleCancelledModal}
                disabled={cancelLoading || isCancelled} // Disable if loading or already completed
              >
                {event?.status === "CANCELLED"
                  ? "CANCELLED"
                  : cancelLoading
                  ? "Processing..."
                  : "Cancel Appointment"}
              </Button>
            ) : null}
          </div>
        </SimpleBar>

        <RescheduleModal
          toggle={toggleRescheduleModal}
          isOpen={isRescheduleModalOpen}
          onStatusChange={onStatusChange}
          // toggle={() => setIsModalOpen(false)}
          onConfirm={rescheduleAction}
          fetchAppointmentDetails={fetchAppointmentDetails}
          dataList={dataList}
          setDataList={setDataList}
          message={`Are you sure you want to reschedule the session of ${selectedSessionTime}?`}
        />
        <ConfirmModal
          isOpen={isCancelled} // Ensures the modal opens when `isCancelled` is true
          toggle={toggleCancelledModal}
          onConfirm={handleCancelled} // Call cancellation action when confirmed
          message={`Are you sure you want to change the appointment status to CANCELLED?`}
        />
        <CompleteConfirmModal
          isOpen={isStatusCompleteConfirmOpen} // Controlled by state
          toggle={toggleCompleteModal} // Toggles visibility
          onConfirm={handleComplete} // Confirm action
          message={`Are you sure you want to change the appointment status to complete?`}
          loading={loading}
        />
        <PaymentStatusModal
          isOpen={isPaymentModalOpen}
          toggle={togglePaymentModal}
          status={selectedPaymentStatus}
          onConfirm={confirmPaymentStatusChange} // Pass the confirm function
        />

        <CalendarModal
          isOpen={isModalOpen}
          toggle={() => setIsModalOpen(false)}
          event={event}
          setEvent={setEvent}
        />

        <TimeExtendModal
          isOpen={isTimeOpen}
          toggle={toggleModal}
          id={selectedSessionId}
          initialTime={selectedTime}
          fetchAppointmentDetails={fetchAppointmentDetails}
          onTimeExtended={handleTimeExtended}
          setEvent={setEvent}
        />
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default DriverRightOffCanvas;
