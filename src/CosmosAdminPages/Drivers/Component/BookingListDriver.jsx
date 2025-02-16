import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Input,
  InputGroup,
  UncontrolledTooltip,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as XLSX from "xlsx";
import { Triangle } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";

import AppointmentService from "../../../services/AppointmentServices/AppointmentService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomDataTable from "../../../Components/CustomTable/CustomTable";
import DriverAppointmentService from "../../../services/AppointmentServices/DriverAppointmentService";
import { formatDateTime } from "../../../Components/Common/FormatDate";
import ConfirmModal from "../../Appointment/Component/ConfirmMOdal";
import toast from "react-hot-toast";

const customStyles = {
  headCells: {
    style: {
      fontSize: "0.92rem", // Change the font size here
      fontWeight: 610, // Optionally change other styles
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem", // Change the font size of rows here
      // You can also optionally add other row styles here
    },
  },
};

const BookingListDriver = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  console.log("🚀 ~ BookingListDriver ~ filteredList:", filteredList);
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [appointmentSelectedStatus, setAppointmentSelectedStatus] =
    useState("");

  const handleFilter = (event) => {
    setFilterText(event.target.value);
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
    const isStatusMatch = selectedStatus
      ? item.payment_status === selectedStatus
      : true;

    const isAppointmentStatusMatch = appointmentSelectedStatus
      ? item.appointment_status === appointmentSelectedStatus
      : true;
    return isSearchMatch && isStatusMatch && isAppointmentStatusMatch;
  });

  async function fetchPosts() {
    setLoading(true);
    try {
      const response = await DriverAppointmentService.getList(id);
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

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isConfirmCancelModalOpen, setConfirmCancelModalOpen] = useState(false);
  const toggleConfirmCancelModal = () => {
    setConfirmCancelModalOpen((prevState) => !prevState);
  };
  const handleCancelAppointment = async () => {
    setLoading(true); // Set loading to true when cancellation starts

    try {
      if (!selectedAppointmentId) {
        toast.error("No appointment selected.");
        return;
      }

      const payload = {
        appointment_id: selectedAppointmentId,
        appointment_status: "CANCELLED",
      };

      await AppointmentService.delete(selectedAppointmentId); // Assume API logic handles payload internally
      setData((prevList) =>
        prevList.filter((pkg) => pkg.id !== selectedAppointmentId)
      );
      toast.success("Appointment has been cancelled.");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment. Please try again.");
    }

    setLoading(false); // Set loading to false when cancellation finishes
    setConfirmCancelModalOpen(false); // Close the modal
    setSelectedAppointmentId(null); // Clear the selected appointment
  };
  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },

    // {
    //   name: "Appointment Code",
    //   selector: (row) => (
    //     <Link to={`/appointment/detail/${row.id}`}>{row.appointment_code}</Link>
    //   ),
    //   sortable: true,
    // },

    {
      name: "Customer",
      cell: (row) => (
        <span>
          {row.customer?.name || ""} {row.customer?.surname || ""}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Pickup Address",
      selector: (row) => (
        <>
          {/* Display the address with a tooltip */}
          <span id={`pickupAddress-${row.id}`}>
            {row.pickup_location || "Not Available"}
          </span>
          {row.pickup_location && (
            <UncontrolledTooltip
              placement="top"
              target={`pickupAddress-${row.id}`}
            >
              {row.pickup_location}
            </UncontrolledTooltip>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => (
        <span
          className={`badge ${
            paymentMethodColors[row.payment_type.title] || "bg-secondary"
          } text-uppercase text-white`}
        >
          {row.payment_type.title || "Not Available"}
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
      // width: "200px",
    },

    {
      name: "Payment",
      cell: (row) => (
        <span
          className={`badge ${
            statusColors[row.payment_status] || "bg-secondary"
          } text-uppercase text-white`}
        >
          {row.payment_status || "No data available"}
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
            appointmentStatusColor[row.appointment_status] || "bg-secondary"
          } text-uppercase text-white`}
        >
          {row.appointment_status || "Not Available"}
        </span>
      ),
      sortable: true,
      center: true,
    },

    {
      name: "Action",

      cell: (row) => (
        <ButtonGroup className="gap-1">
          <Link
            to={`/appointment/detail/${row.id}`}
            className="btn btn-sm text-success"
          >
            <i class="ri-eye-line"></i>
          </Link>
          <Button
            color="rounded-circle btn btn-danger"
            className="rounded-circle btn-sm"
            onClick={() => {
              setSelectedAppointmentId(row.id); // Set the selected appointment ID
              toggleConfirmCancelModal(); // Open the confirmation modal
            }}
          >
            <i className="bx bx-trash"></i>
          </Button>
        </ButtonGroup>
      ),
      center: true,
    },
  ];

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const appointmentStatusChange = (status) => {
    setAppointmentSelectedStatus(status);
  };
  return (
    <div>
      <Row className="mb-2">
        <Col lg={5}>
          <InputGroup>
            <Input
              placeholder="Search by customer name"
              className="mb-2"
              value={filterText}
              onChange={handleFilter}
            />
          </InputGroup>
        </Col>
        <Col
          md={7}
          xs={12}
          className="d-flex flex-wrap justify-content-end gap-2"
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

      {loading ? (
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
                wrapperStyle={{}}
                wrapperClass=""
              />
              <h5 className="mt-1">Loading...</h5>
            </div>
          }
          columns={columns}
          data={filteredData}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmCancelModalOpen}
        toggle={toggleConfirmCancelModal}
        onConfirm={handleCancelAppointment}
        loading={loading}
      />
    </div>
  );
};

export default BookingListDriver;
