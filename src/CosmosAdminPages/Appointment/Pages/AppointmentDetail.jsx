import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Button, Badge, Card } from "reactstrap";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import toast from "react-hot-toast";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import PaymentService from "../../../services/Payment Services/PaymentService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PaymentStatusModal from "../Component/PaymentStatusModal";
import { formatDateTime } from "../Component/FormatDate";
import ConfirmModal from "../Component/ConfirmMOdal";
import { useNavigate } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import CompleteConfirmModal from "../Component/CompleteConfirmModal";

const AppointmentDetail = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const userType = user?.user?.user_type;
  console.log("🚀 ~ AppointmentDetail ~ userType:", userType);
  const navigate = useNavigate();
  const [dataList, setDataList] = useState({});
  const { id } = useParams();
  const [receiveDropdownOpen, setReceiveDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const [selectedAppointmentStatus, setSelectedAppointmentStatus] =
    useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  const printRef = useRef(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isConfirmCancelModalOpen, setIsConfirmCancelModalOpen] =
    useState(false);

  // Refs for dropdowns
  const receiveDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  const togglePaymentModal = () => {
    setIsPaymentModalOpen(!isPaymentModalOpen);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await AppointmentService.detail(id);
        setDataList(response.data);

        setSelectedPaymentStatus(response.data.payment_status);
        setSelectedAppointmentStatus(response.data.appointment_status);
      } catch (error) {
        console.log("Error fetching appointment details:", error);
      }
      setLoading(false);
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const toggleConfirmCancelModal = () => {
    setIsConfirmCancelModalOpen(!isConfirmCancelModalOpen);
  };
  const handleCancelAppointment = async () => {
    setLoading(true); // Set loading to true when cancellation starts

    try {
      const payload = {
        appointment_id: id,
        appointment_status: "CANCELLED",
      };

      await AppointmentService.delete(id);
      toast.success("Appointment has been cancelled.");
      navigate("/appointment");
    } catch (error) {
      console.log("Error cancelling appointment:", error.message);
      toast.error("Failed to cancel appointment.");
    }

    setLoading(false); // Set loading to false when cancellation finishes
  };

  const handlePaymentStatusChange = (status) => {
    // setSelectedPaymentStatus(status.label);
    setIsPaymentModalOpen(true);
    setStatusDropdownOpen(false);
  };

  // const totalAmount = dataList.total_amount;
  const confirmPaymentStatusChange = async (inputData) => {
    try {
      const payload = {
        appointment_id: id,
        payment_status: selectedPaymentStatus, // Use the current selected status
        ref_code: inputData.referenceNo,
        remarks: inputData.remarks,
        amount: inputData.amount,
      };

      // Update the payment status via API
      await AppointmentService.updatePaymentStatus(id, payload);

      // Refetch the updated appointment details from the API
      const response = await AppointmentService.detail(id);

      // Update the state with the latest data
      setDataList(response.data); // Update the data list if necessary
      setSelectedPaymentStatus(response.data.payment_status); // Set new payment status
      setSelectedAppointmentStatus(response.data.appointment_status); // Update appointment status

      toast.success("Payment Successfully Received");

      // Close the modal
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status.");
    }
  };

  const receivedOptions = [
    { label: "CONFIRMED", value: 1 },
    // { label: "PENDING", value: 2 },
    { label: "CANCELLED", value: 2 },
  ];

  const statusOptions = [
    { label: "PAID", value: 1 },
    { label: "PENDING", value: 2 },
  ];

  const statusColors = {
    "Reschedule Confirmed": "bg-secondary",
    CONFIRMED: "bg-success",
    "Admin Rescheduled": "bg-dark",
    "Client Rescheduled": "bg-info",
    PENDING: "bg-warning",
    CANCELLED: "bg-danger",
  };

  const paymentStatusColors = {
    PAID: "bg-success",
    PENDING: "bg-warning",
  };

  const appointmentButtonClass =
    statusColors[selectedAppointmentStatus] || "bg-secondary";

  const paymentButtonClass =
    paymentStatusColors[selectedPaymentStatus] || "bg-secondary";

  const [showMore, setShowMore] = useState(false);
  const limit = 3; // Number of dates to show initially

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        receiveDropdownRef.current &&
        !receiveDropdownRef.current.contains(event.target)
      ) {
        setReceiveDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [loading, setLoading] = useState(false);

  const [isCancelled, setIsCancelled] = useState(false); // State to track completion
  const [isCompleted, setIsCompleted] = useState(false); // State to track completion
  const [isStatusCompleteConfirmOpen, setIsStatusCompleteConfirmOpen] =
    useState(false);

  const handleCompleteModal = () => {
    setIsStatusCompleteConfirmOpen(!isStatusCompleteConfirmOpen);
  };

  const handleComplete = async () => {
    setLoading(true); // Start loading

    try {
      // Mark the appointment as complete
      const response = await AppointmentService.complete(id);
      setIsCompleted(true);
      // Fetch updated appointment details
      const updatedDetails = await AppointmentService.detail(id);
      setDataList((prevEvent) => ({
        ...prevEvent,
        appointment: updatedDetails.data,
        status: "COMPLETED", // Ensure the status reflects the change
      }));

      handleCompleteModal();
      toast.success("Completed Successfull.");
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          {userType === "DRIVER" ? (
            <BreadCrumb
              pageTitle="Appointment"
              title="Appointment Detail"
              breadcrumbItems={[
                { title: "Back To List ", link: "/driver-appointment" },
              ]}
            />
          ) : (
            <BreadCrumb
              pageTitle="Appointment"
              title="Appointment Detail"
              breadcrumbItems={[
                { title: "Back To List ", link: "/appointment" },
              ]}
            />
          )}
        </div>

        {loading ? (
          <div
            style={{ height: "100vh" }}
            className="d-flex justify-content-center align-items-center align-content-center"
          >
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#5B71B9"
              ariaLabel="triangle-loading"
            />
          </div>
        ) : (
          <div className="mb-4 m-1 ">
            <Card className="p-4">
              <Row>
                <Col xs={12} md={5} lg={12} className=" mb-2">
                  <Row>
                    <Col lg={4} xs={12}>
                      <div className="align-content-center d-flex justify-content-center mb-3">
                        <img
                          src={
                            dataList?.customer?.avatar?.path || "/avatar.jpg"
                          }
                          height="200"
                          className="avatar-xxl rounded bg-light"
                        />
                      </div>
                    </Col>

                    <Col lg={8} xs={12}>
                      <Row>
                        <Col lg={6} xs={12}>
                          <Row>
                            <Col lg={12}>
                              <h6 className="fs-16 mb-3">
                                Full Name: <br />
                                <span className="fw-bold ">
                                  {dataList.customer?.name}{" "}
                                  {dataList.customer?.surname}
                                </span>
                              </h6>
                            </Col>
                            <Col lg={12}>
                              <h6 className="fs-16 mb-3">
                                Email: <br />
                                <span className="fw-bold ">
                                  {dataList.customer?.email}
                                </span>
                              </h6>
                            </Col>
                            <Col lg={12}>
                              <h6 className="fs-16 mb-3">
                                Driving License No: <br />
                                <span className="fw-bold ">
                                  {dataList.customer?.driving_license_no}
                                </span>
                              </h6>
                            </Col>
                            <Col lg={12}>
                              <h6 className="fs-16 mb-3">
                                Phone Number: <br />
                                <span className="fw-bold ">
                                  {/* +61 {dataList.customer?.phone_number} */}
                                  +61{" "}
                                  {dataList.customer?.phone_number
                                    ? dataList.customer?.phone_number.toString()
                                        .length === 9
                                      ? `0${dataList.customer?.phone_number}`
                                      : dataList.customer?.phone_number
                                    : "Invalid number"}
                                </span>
                              </h6>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={6} xs={12}>
                          <Row>
                            {dataList.package?.package_type === "PER-HOUR" ? (
                              <Col lg={6} xs={12} className="mb-2">
                                <Button
                                  className={`btn-sm text-dark ${
                                    isCompleted ||
                                    selectedAppointmentStatus === "COMPLETED"
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
                                    selectedAppointmentStatus === "COMPLETED"
                                  } // Disable if loading or already completed
                                >
                                  {isCompleted ||
                                  selectedAppointmentStatus === "COMPLETED"
                                    ? "COMPLETED"
                                    : loading
                                    ? "Processing..."
                                    : " Mark as Complete"}
                                </Button>
                              </Col>
                            ) : null}

                            <Col lg={12} className="mb-2">
                              <h6>
                                Appointment Status:
                                <span> {selectedAppointmentStatus}</span>
                              </h6>
                              {/* <div
                         className="dropdown-container"
                         ref={receiveDropdownRef}
                       >
                         <button
                           type="button"
                           className={`btn ${appointmentButtonClass} dropdown-toggle`}
                           onClick={toggleReceiveDropdown}
                         >
                           {selectedAppointmentStatus}
                         </button>
                         {receiveDropdownOpen && (
                           <ul className="dropdown-menu show">
                             {receivedOptions.map((item, index) => (
                               <li key={index}>
                                 <a
                                   className="dropdown-item"
                                   href="#"
                                   onClick={() =>
                                     handleStatusChange(item)
                                   }
                                 >
                                   {item.label}
                                 </a>
                               </li>
                             ))}
                           </ul>
                         )}
                       </div> */}

                              {dataList.package?.package_type === "PER-HOUR" &&
                              selectedPaymentStatus !== "PAID" &&
                              selectedAppointmentStatus !== "COMPLETED" &&
                              userType !== "DRIVER" ? (
                                <Button
                                  className={`btn-sm text-dark ${
                                    isCancelled ||
                                    selectedAppointmentStatus === "CANCELLED"
                                      ? "btn-danger"
                                      : "btn-secondary" // This would be for 'CONFIRMED'
                                  }`}
                                  onClick={toggleConfirmCancelModal}
                                  disabled={
                                    selectedAppointmentStatus === "CANCELLED"
                                  }
                                >
                                  {isCancelled ||
                                  selectedAppointmentStatus === "CANCELLED"
                                    ? "CANCELLED"
                                    : loading
                                    ? "Processing..."
                                    : "Cancel"}
                                </Button>
                              ) : null}
                            </Col>

                            <Col lg={12}>
                              <h6 className="fs-16">
                                Appointment Date: <br />
                              </h6>
                              <h6 className="fs-16 ">
                                {dataList &&
                                dataList.sessions &&
                                dataList.sessions.length > 0 ? (
                                  dataList.sessions
                                    .slice(
                                      0,
                                      showMore
                                        ? dataList.sessions.length
                                        : limit
                                    )
                                    .map((item, index) => (
                                      <div key={index} className="fw-bold">
                                        {formatDateTime(item.start_time)}
                                      </div>
                                    ))
                                ) : (
                                  <div>No appointments available</div>
                                )}
                                {dataList &&
                                  dataList.sessions &&
                                  dataList.sessions.length > limit && (
                                    <button
                                      onClick={toggleShowMore}
                                      className="btn btn-link mt-0"
                                    >
                                      {showMore ? "Show Less" : "Show More"}
                                    </button>
                                  )}
                              </h6>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>

                <hr className="middle" style={{ width: "100%" }} />

                <Col lg={6}>
                  <h6 className="fs-16 mb-3">
                    Package Name:{" "}
                    <span className="fw-bold ">{dataList.package?.name}</span>
                  </h6>
                </Col>
                <Col lg={6}>
                  <h6 className="fs-16 mb-3">
                    Package Amount:{" "}
                    <span className="fw-bold ">${dataList?.total_amount}</span>
                  </h6>
                </Col>
                <Col lg={6}>
                  <h6 className="fs-16 mb-3">
                    Lesson Duration:{" "}
                    <span className="fw-bold ">
                      {dataList.session_duration} hour
                    </span>
                  </h6>
                </Col>
                <Col lg={6}>
                  <h6 className="fs-16 mb-3">
                    Pickup Address:{" "}
                    <span className="fw-bold ">{dataList.pickup_location}</span>
                  </h6>
                </Col>
                <hr className="middle" style={{ width: "100%" }} />
                {/* <Col lg={6}>
           {dataList.driver?.user?.name &&
             dataList.driver?.user?.surname && (
               <h6 className="fs-16 mb-3">
                 Instructor:{" "}
                 <span className="fw-bold">
                   {dataList.driver.user.name}{" "}
                   {dataList.driver.user.surname}
                 </span>
               </h6>
             )}
         </Col> */}
                {userType !== "DRIVER" ? (
                  <>
                    <Col lg={6}>
                      {dataList?.driver?.user ? (
                        <h6 className="fs-16 mb-3 d-flex align-items-center">
                          Instructor:{" "}
                          <span className="fw-bold">
                            {dataList.driver.user.name}{" "}
                            {dataList.driver.user.surname}
                          </span>
                          {dataList.driver.user.avatar?.path ? (
                            <img
                              src={dataList.driver.user.avatar.path}
                              alt={`${dataList.driver.user.name} ${dataList.driver.user.surname}`}
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                marginLeft: "10px",
                              }}
                            />
                          ) : (
                            <img
                              src={avatar1}
                              alt="Default Avatar"
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                        </h6>
                      ) : (
                        <h6 className="fs-16 mb-3">Loading Instructor...</h6>
                      )}
                    </Col>

                    <Col lg={6}>
                      {dataList.driver?.user?.address && (
                        <h6 className="fs-16 mb-3">
                          Residential Address:{" "}
                          <span className="fw-bold">
                            {dataList.driver.user.address}
                          </span>
                        </h6>
                      )}
                    </Col>
                    <Col lg={6}>
                      {dataList.driver?.user?.driving_license_no && (
                        <h6 className="fs-16 mb-3">
                          Driving License:{" "}
                          <span className="fw-bold">
                            {dataList.driver.user.driving_license_no}
                          </span>
                        </h6>
                      )}
                    </Col>
                    <Col lg={6}>
                      {dataList.driver?.user?.phone_number && (
                        <h6 className="fs-16 mb-3">
                          Phone Number:{" "}
                          <span className="fw-bold">
                            +61{" "}
                            {dataList.driver.user.phone_number
                              ? dataList.driver.user.phone_number.toString()
                                  .length === 9
                                ? `0${dataList.driver.user.phone_number}`
                                : dataList.driver.user.phone_number
                              : "Invalid number"}
                          </span>
                        </h6>
                      )}
                    </Col>
                    <Col lg={6}>
                      {dataList.driver?.user?.email && (
                        <h6 className="fs-16 mb-3">
                          Email:{" "}
                          <span className="fw-bold">
                            {dataList.driver.user.email}
                          </span>
                        </h6>
                      )}
                    </Col>
                    <hr className="middle" style={{ width: "100%" }} />
                  </>
                ) : null}

                <Col lg={4}>
                  <h6 className="fs-16">
                    Payment Type: <br />
                    {dataList.payment_type_id === 1 ? "Cash" : "Card"}
                  </h6>
                </Col>

                <Col lg={4} className="d-flex gap-2 mb-1">
                  <h6 className="fs-16">
                    Payment Status:{" "}
                    <Badge
                      className={paymentStatusColors[selectedPaymentStatus]} // Dynamically set the class
                    >
                      {selectedPaymentStatus}
                    </Badge>
                  </h6>
                </Col>
                <Col lg={4} className="mb-3">
                  <button
                    type="button"
                    className={`btn ${paymentButtonClass}`}
                    onClick={() => handlePaymentStatusChange()}
                    disabled={
                      selectedAppointmentStatus === "CANCELLED" ||
                      selectedPaymentStatus === "PAID"
                    }
                    style={{ border: "none" }}
                  >
                    <span>Receive Payment</span>
                  </button>
                </Col>
                <Col lg={12} className="">
                  <div className="d-flex justify-content-between">
                    <h6>Base Fare: </h6>
                    <span className="fw-bold text-end ">
                      ${dataList.package?.price}
                    </span>
                  </div>
                  {dataList.payment_processing_fee && (
                    <>
                      <div className="d-flex justify-content-between">
                        <h6>Processing Fee: </h6>
                        <span className="fw-bold text-end ">
                          ${dataList.payment_processing_fee}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="d-flex justify-content-between">
                    <h6>Total: </h6>
                    <span className="fw-bold text-end ">
                      ${dataList.total_amount}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </div>

      <PaymentStatusModal
        isOpen={isPaymentModalOpen}
        toggle={togglePaymentModal}
        status={selectedPaymentStatus}
        onConfirm={confirmPaymentStatusChange} // Pass the confirm functio
      />

      <ConfirmModal
        isOpen={isConfirmCancelModalOpen}
        toggle={toggleConfirmCancelModal}
        onConfirm={handleCancelAppointment}
        loading={loading}
      />

      <CompleteConfirmModal
        isOpen={isStatusCompleteConfirmOpen} // Controlled by state
        toggle={handleCompleteModal} // Toggles visibility
        onConfirm={handleComplete} // Confirm action
        message={`Are you sure you want to change the appointment status to complete?`}
        loading={loading} // Pass loading state
      />
    </>
  );
};

export default AppointmentDetail;
