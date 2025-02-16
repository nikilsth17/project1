import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";
import CustomDataTable from "../../../Components/CustomTable/CustomTable";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";
import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import useIsSmallScreen from "../../Payment Type/Component/small screen/SmallScreen";
import RescheduleModal from "../Component/RescheduleModal";
import CustomerServices from "../../../services/DibyaServices/CustomerServices/Customer.services";
import ConfirmModal from "../Component/ConfirmMOdal";
import { formatDateTime } from "../../../Components/Common/FormatDate";
import DriverServices from "../../../services/DriverServices/DriverServices";
import Select from "react-select";
import UpdatedPagination from "../../../Components/Common/UpdatedPagination";

const customStyles = {
  headCells: {
    style: {
      fontSize: "0.92rem",
      fontWeight: 610,
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem",
    },
  },
};

const AppointmentList = () => {
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState({});

  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [filterDropdownOpen, setFilterDropOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [appointmentSelectedStatus, setAppointmentSelectedStatus] =
    useState("");

  const [selectedAction, setSelectedAction] = useState({});
  const isSmallScreen = useIsSmallScreen();
  const toggleDeleteModal = () => setDeleteModal((prev) => !prev);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Adjust this based on your default rows per page

  const [isConfirmCancelModalOpen, setConfirmCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const [driverData, setDriverData] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage, page) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(page);
  };

  const handleFilter = (event) => {
    setFilterText(event.target.value);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const appointmentStatusChange = (status) => {
    setAppointmentSelectedStatus(status);
  };
  const statusColors = {
    PAID: "bg-success",
    PENDING: "bg-warning",
    CANCELLED: "bg-danger",
  };

  const appointmentStatusColor = {
    CONFIRMED: "bg-success",
    SCHEDULED: "bg-warning",
    CANCELLED: "bg-danger",
  };

  const paymentMethodColors = {
    Card: "bg-success",
    Cash: "bg-warning",
  };

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      try {
        await AppointmentService.delete(selectedDeleteItem.id);
        setData((prev) =>
          prev.filter((customer) => customer.id !== selectedDeleteItem.id)
        );
        setSelectedDeleteItem(null);
        toggleDeleteModal();
        toast.success("Record deleted successfully");
      } catch (error) {
        toast.error("Failed to delete the record");
        console.error("Error deleting item:", error);
      }
    }
  };

  async function fetchPosts() {
    setLoading(true);
    try {
      const response = await AppointmentService.getList();
      console.log(response.data, "Appointment data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  // const handleAction = async (actionType, appointmentId) => {
  //   setSelectedAction((prev) => ({
  //     ...prev,
  //     [appointmentId]: actionType,
  //   }));

  //   let newStatus = "";

  //   try {
  //     switch (actionType) {
  //       case "Confirm":
  //         await AppointmentService.confirm({
  //           appointment_id: appointmentId,
  //           status: "CONFIRMED",
  //         });
  //         toast.success("Appointment confirmed successfully!");
  //         newStatus = "CONFIRMED";
  //         break;
  //       case "Cancel":
  //         toast.error("Appointment canceled.");
  //         newStatus = "CANCELED";
  //         break;
  //       case "Reschedule":
  //         toast.info("Appointment rescheduled.");
  //         newStatus = "RESCHEDULED";
  //         break;
  //       default:
  //         break;
  //     }

  //     setData((prevDataList) =>
  //       prevDataList.map((appointment) =>
  //         appointment.id === appointmentId
  //           ? { ...appointment, appointment_status: newStatus }
  //           : appointment
  //       )
  //     );
  //   } catch (error) {
  //     toast.error("Error performing action");
  //     console.error("Error performing action:", error);
  //   }

  //   setDropdownOpen((prev) => ({
  //     ...prev,
  //     [appointmentId]: false,
  //   }));
  // };

  const toggleDropdown = (appointmentId) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [appointmentId]: !prevState[appointmentId],
    }));
  };

  const getButtonColor = (appointmentId) => {
    if (selectedAction[appointmentId] === "CANCELLED") {
      return "dark";
    }
    switch (selectedAction[appointmentId]) {
      case "Confirm":
        return "success";
      case "Cancel":
        return "danger";
      case "Reschedule":
        return "primary";
      default:
        return "secondary";
    }
  };

  const toggleConfirmCancelModal = () => {
    setConfirmCancelModalOpen((prevState) => !prevState);
  };

  const handleAppointmentStatusChange = async (status, id) => {
    if (status === "CANCELLED") {
      setSelectedAppointmentId(id);
      setConfirmCancelModalOpen(true); // Open the cancel confirmation modal
      return;
    }

    // Proceed with other status changes
    try {
      const payload = { appointment_id: id, appointment_status: status };
      await AppointmentService.updateStatus(id, payload);
      toast.success("Appointment status changed to " + status);
      setData((prevDataList) =>
        prevDataList.map((appointment) =>
          appointment.id === id
            ? { ...appointment, appointment_status: status }
            : appointment
        )
      );
    } catch (error) {
      console.log("Error updating appointment status:", error.message);
      toast.error("Failed to update appointment status.");
    }
  };

  const handleCancelAppointment = async () => {
    setLoading(true); // Set loading to true when cancellation starts

    try {
      const payload = {
        appointment_id: selectedAppointmentId,
        appointment_status: "CANCELLED",
      };

      await AppointmentService.delete(selectedAppointmentId);
      toast.success("Appointment has been cancelled.");
      setData((prevDataList) =>
        prevDataList.map((appointment) =>
          appointment.id === selectedAppointmentId
            ? { ...appointment, appointment_status: "CANCELLED" }
            : appointment
        )
      );
      fetchPosts();
    } catch (error) {
      console.log("Error cancelling appointment:", error.message);
      toast.error("Failed to cancel appointment.");
    }

    setLoading(false); // Set loading to false when cancellation finishes
    setConfirmCancelModalOpen(false); // Close the modal
  };

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedSessionTime, setSelectedSessionTime] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const toggleRescheduleModal = () => {
    setIsRescheduleModalOpen(!isRescheduleModalOpen);
  };

  const handleReschedule = (sessionId, sessionTime, row) => {
    setSelectedSessionId(sessionId);
    setSelectedSessionTime(sessionTime);

    // Store the entire row's data in dataList
    setDataList(row);

    setIsRescheduleModalOpen(true);
  };

  // Callback function for child component to notify rescheduling is done
  const onStatusChange = async () => {
    // After rescheduling, refresh the table data
    await fetchPosts();
    setIsRescheduleModalOpen(false); // Close modal
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      width: "75px",
    },

    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Customer
        </div>
      ),
      cell: (row) => (
        <span>
          {row.customer?.name || ""} {row.customer?.surname || ""}
        </span>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Instructor
        </div>
      ),
      cell: (row) => (
        <span>
          {row.driver?.user?.name || ""} {row.driver?.user?.surname || ""}
        </span>
      ),
      sortable: true,
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Pick up Address
        </div>
      ),
      selector: (row) => (
        <>
          {/* Display the address with a tooltip */}
          <span id={`pickupAddress-${row.id}`}>
            {row?.pickup_location || "Not Available"}
          </span>
          {row.pickup_location && (
            <UncontrolledTooltip
              placement="top"
              target={`pickupAddress-${row.id}`}
            >
              {row?.pickup_location || ""}
            </UncontrolledTooltip>
          )}
        </>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Type",
      selector: (row) => (
        <span
          className={`badge ${
            paymentMethodColors[row?.payment_type?.title] || "bg-secondary"
          } text-uppercase text-white`}
        >
          {row?.payment_type?.title || "Not Available"}
        </span>
      ),
      sortable: true,
      center: true,
    },

    {
      name: "Date",
      selector: (row) => {
        const startTime = row.sessions[0]?.start_time;
        if (!startTime) return "Not Available";

        // Return a div with the formatted date and tooltip
        return (
          <div>
            <span id={`dateTooltip-${row.id}`}>
              {formatDateTime(startTime)}{" "}
            </span>
            <UncontrolledTooltip
              placement="top"
              target={`dateTooltip-${row.id}`}
            >
              {formatDateTime(startTime)}
            </UncontrolledTooltip>
          </div>
        );
      },
      sortable: true,
      wrap: true,
      // width: "200px",
    },

    {
      name: "Payment",
      cell: (row) => (
        <span
          className={`badge ${
            statusColors[row?.payment_status] || "bg-secondary"
          } text-uppercase text-white`}
        >
          {row?.payment_status || "No data available"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`badge ${
            appointmentStatusColor[row?.appointment_status] || "bg-secondary"
          } text-uppercase text-white`}
        >
          {row?.appointment_status || "Not Available"}
        </span>
      ),
      sortable: true,
      center: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          <Link
            to={`/appointment/detail/${row.id}`}
            className="btn btn-sm text-success"
          >
            <i
              class="ri-eye-line"
              style={{ fontWeight: "bold", fontSize: "16px" }}
            ></i>
          </Link>
          {row.appointment_status !== "COMPLETED" ? (
            <Dropdown
              isOpen={dropdownOpen[row.id] || false} // Individual dropdown state
              toggle={() => toggleDropdown(row.id)} // Toggle for specific dropdown
              disabled={row.appointment_status === "CANCELLED"} // Disable if appointment is cancelled
            >
              <DropdownToggle
                caret
                color={
                  row.appointment_status === "CANCELLED"
                    ? "dark"
                    : getButtonColor(row.id)
                }
                size="sm"
                disabled={row.appointment_status === "CANCELLED"} // Double-check for disabling on 'CANCELLED'
              >
                {selectedAction[row.id] || "Action"}
              </DropdownToggle>

              <DropdownMenu container="body">
                {row.package?.package_type === "PER-HOUR" ? (
                  <DropdownItem
                    onClick={() =>
                      handleAppointmentStatusChange("CANCELLED", row.id)
                    }
                  >
                    Cancel
                  </DropdownItem>
                ) : null}

                <DropdownItem
                  onClick={() =>
                    handleReschedule(
                      row.sessions[0]?.id,
                      row.sessions[0]?.start_time,
                      row
                    )
                  } // Pass session ID, time, and row data
                >
                  Reschedule
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : null}
        </>
      ),
      center: true,
    },
  ];

  const fetchAppointmentDetails = async (appointmentId) => {
    try {
      const response = await AppointmentService.detail(appointmentId); // Fetch appointment details by ID
      console.log("Appointment Response:", response);

      const customerResponse = await CustomerServices.getCustomerDetail(
        response?.data?.customer_id // Fetch customer details by customer ID
      );
      console.log("Customer Response:", customerResponse);

      // Update the state with fetched data
      setDataList(response.data);
      setSelectedAppointmentStatus(response.data.appointment_status);
      setSelectedPaymentStatus(response.data.payment_status);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  const rescheduleAction = () => {
    // Logic to reschedule session using selectedSessionId
    console.log("Reschedule confirmed for session:", selectedSessionId);
    toggleRescheduleModal(); // Close the modal after rescheduling
  };

  //filter by driver

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await DriverServices.get();
        setDriverData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDriver();
  }, []);

  const driverOptions = [
    { value: "all", label: "All" }, // Manually added option
    ...(driverData?.map((item) => ({
      value: item.id,
      label: `${item.name} ${item.surname}`,
    })) || []), // Existing options from driverData
  ];

  const [selectedDriver, setSelectedDriver] = useState("");
  const handleDriverChange = (selectedOption) => {
    setSelectedDriver(selectedOption || "");
    console.log("Selected Driver:", selectedOption);
  };
  const filteredData = data.filter((item) => {
    console.log("🚀 ~ filteredData ~ item:", item);
    const searchText = filterText.toLowerCase(); // The text entered in the search input
    const fullName = `${item.customer?.name || ""} ${
      item.customer?.surname || ""
    }`.toLowerCase(); // Full name of the customer

    // Check if the full name or pickup location contains the search text
    const isSearchMatch =
      fullName.includes(searchText) ||
      item.pickup_location?.toLowerCase().includes(searchText);

    // Check if the selected status matches the payment status, or if no status is selected, show all
    const isStatusMatch = selectedStatus
      ? item.payment_status === selectedStatus
      : true;

    const isAppointmentStatusMatch = appointmentSelectedStatus
      ? item.appointment_status === appointmentSelectedStatus
      : true;

    const matchesDriver =
      !selectedDriver || selectedDriver.value === "all"
        ? true // Show all events when no filter is selected or "All" is selected
        : item?.driver_id === selectedDriver?.value;

    return (
      isSearchMatch &&
      isStatusMatch &&
      isAppointmentStatusMatch &&
      matchesDriver
    );
  });

  // Pagination logic for small screens
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Appointment List" pageTitle="Appointment" />
      </div>
      <Row className=" align-items-center">
        <Col md={4} xs={12} className="mb-2">
          <InputGroup className="">
            <Input
              placeholder="Search by Customer, Pick up address"
              value={filterText}
              onChange={handleFilter}
              className="col-sm-12"
            />
          </InputGroup>
        </Col>
        <Col md={3} xs={12} className="mb-2">
          <div style={{ position: "relative" }}>
            <i
              className="bx bx-user"
              style={{
                position: "absolute",
                left: "5px", // Reduce left offset to align properly
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#6c757d",
                fontSize: "16px",
                zIndex: 999,
              }}
            ></i>

            <Select
              options={driverOptions}
              value={selectedDriver}
              onChange={handleDriverChange}
              placeholder="Select Instructor"
              // isClearable
              isClearable={selectedDriver?.value !== "all"}
              menuPortalTarget={document.body} // Renders the menu in the body
              styles={{
                control: (base, state) => ({
                  ...base,
                  paddingLeft: "25px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 1050, // Adjust as needed
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999, // Ensure it’s above everything
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6c757d",
                }),
                singleValue: (base) => ({
                  ...base,
                  marginLeft: "5px",
                }),
              }}
            />
          </div>
        </Col>
        <Col
          md={5}
          xs={12}
          className="d-flex flex-wrap justify-content-end gap-2 mb-2"
        >
          <Dropdown
            isOpen={isOpen}
            toggle={() => setIsOpen(!isOpen)}
            className="w-auto shadow-sm"
          >
            <DropdownToggle caret className="btn-secondary border rounded">
              {selectedStatus || "Payment Status"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => handleStatusChange("")}>
                All
              </DropdownItem>
              <DropdownItem onClick={() => handleStatusChange("PAID")}>
                Paid
              </DropdownItem>
              <DropdownItem onClick={() => handleStatusChange("PENDING")}>
                Pending
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown
            isOpen={isAppointmentOpen}
            toggle={() => setIsAppointmentOpen(!isAppointmentOpen)}
            className="w-auto shadow-sm"
          >
            <DropdownToggle caret className="btn-secondary border rounded">
              {appointmentSelectedStatus || "Appointment Status"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => appointmentStatusChange("")}>
                All
              </DropdownItem>
              <DropdownItem
                onClick={() => appointmentStatusChange("CONFIRMED")}
              >
                Confirmed
              </DropdownItem>
              <DropdownItem
                onClick={() => appointmentStatusChange("SCHEDULED")}
              >
                Scheduled
              </DropdownItem>
              <DropdownItem
                onClick={() => appointmentStatusChange("COMPLETED")}
              >
                Completed
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>

      {isSmallScreen ? (
        loading ? (
          <div className="d-flex justify-content-center my-3">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#5B71B9"
              ariaLabel="triangle-loading"
            />
          </div>
        ) : (
          <>
            {" "}
            <Row>
              {currentItems?.map((item, index) => (
                <Col md={12} key={index} className="mb-1 smallScreen">
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">
                        <strong> Customer Name: </strong>
                        {item?.customer?.name || ""}{" "}
                        {item?.customer?.surname || ""}
                      </CardTitle>
                      <CardText>
                        <strong>Instructor Name:</strong>{" "}
                        {item.driver?.user?.name || ""}{" "}
                        {item.driver?.user?.surname || ""}
                      </CardText>
                      <CardText>
                        <strong>Pick up Address:</strong>{" "}
                        {item?.pickup_location}
                      </CardText>
                      <CardText>
                        <strong>Payment Processors:</strong>{" "}
                        <span
                          className={`badge ${
                            paymentMethodColors[item?.payment_type?.title] ||
                            "bg-secondary"
                          } text-uppercase text-white`}
                        >
                          {item?.payment_type?.title}
                        </span>
                      </CardText>
                      <CardText>
                        <strong>Date:</strong>{" "}
                        {formatDateTime(item.sessions[0]?.start_time)}
                      </CardText>
                      <CardText>
                        <strong>Payment Status:</strong>{" "}
                        <span
                          className={`badge ${
                            statusColors[item?.payment_status] || "bg-secondary"
                          } text-uppercase text-white`}
                        >
                          {item?.payment_status}
                        </span>
                      </CardText>
                      <CardText>
                        <h6>
                          Appointment Status:{" "}
                          <span
                            className={`badge ${
                              appointmentStatusColor[
                                item?.appointment_status
                              ] || "bg-secondary"
                            } text-uppercase text-white`}
                          >
                            {item?.appointment_status || "Not Available"}
                          </span>
                        </h6>
                      </CardText>
                      <div className="text-end d-flex gap-3 justify-content-end align-items-end">
                        <Link
                          to={`/appointment/detail/${item.id}`}
                          className="btn btn-sm text-success"
                        >
                          <i
                            class="ri-eye-line"
                            style={{ fontWeight: "bold", fontSize: "16px" }}
                          ></i>
                        </Link>
                        <Dropdown
                          isOpen={dropdownOpen[item.id] || false} // Individual dropdown state
                          toggle={() => toggleDropdown(item.id)} // Toggle for specific dropdown
                          className="my-2"
                          disabled={item.appointment_status === "CANCELLED"} // Disable if appointment is cancelled
                        >
                          <DropdownToggle
                            caret
                            // color={getButtonColor(item.id)}
                            color={
                              item.appointment_status === "CANCELLED"
                                ? "dark"
                                : getButtonColor(item.id)
                            }
                            size="sm"
                          >
                            {selectedAction[item.id] || "Action"}
                          </DropdownToggle>
                          <DropdownMenu container="body">
                            {/* <DropdownItem
                            onClick={() =>
                              handleAppointmentStatusChange(
                                "CONFIRMED",
                                item.id
                              )
                            }
                          >
                            Confirm
                          </DropdownItem> */}
                            {item?.package?.package_type === "PER-HOUR" ? (
                              <DropdownItem
                                onClick={() =>
                                  handleAppointmentStatusChange(
                                    "CANCELLED",
                                    item.id
                                  )
                                }
                              >
                                Cancel
                              </DropdownItem>
                            ) : null}

                            <DropdownItem
                              onClick={() =>
                                handleReschedule(
                                  item.sessions[0]?.id,
                                  item.sessions[0]?.start_time,
                                  item
                                )
                              }
                            >
                              Reschedule
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
            <UpdatedPagination
              data={filteredData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              perPageData={rowsPerPage}
              className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0"
            />
          </>
        )
      ) : (
        <CustomDataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          progressPending={loading}
          customStyles={customStyles}
          progressComponent={
            <div className="my-3">
              <Triangle
                visible={true}
                height="80"
                width="80"
                color="#5B71B9"
                ariaLabel="triangle-loading"
              />
            </div>
          }
          columns={columns}
          data={filteredData} // The complete dataset
          onChangePage={handlePageChange} // Handles page change
          onChangeRowsPerPage={handleRowsPerPageChange} // Handles rows per page change
          onReschedule={handleReschedule} // Trigger reschedule logic
        />
      )}

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
      />

      <RescheduleModal
        toggle={toggleRescheduleModal}
        isOpen={isRescheduleModalOpen}
        // toggle={() => setIsModalOpen(false)}
        onStatusChange={onStatusChange} // Notify parent on completion
        onConfirm={rescheduleAction}
        dataList={dataList}
        setDataList={setDataList}
        message={`Are you sure you want to reschedule the session of ${selectedSessionTime}?`}
      />

      <ConfirmModal
        isOpen={isConfirmCancelModalOpen}
        toggle={toggleConfirmCancelModal}
        onConfirm={handleCancelAppointment}
        loading={loading}
      />
    </div>
  );
};

export default AppointmentList;
