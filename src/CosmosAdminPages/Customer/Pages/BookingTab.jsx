import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  UncontrolledTooltip,
} from "reactstrap";
import classnames from "classnames";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import PaymentService from "../../../services/PaymentServices/PaymentService";

import useIsSmallScreen from "../../Payment Type/Component/small screen/SmallScreen";

import {
  formatDate,
  formatDateTime,
} from "../../../Components/Common/FormatDate";
import Flatpickr from "react-flatpickr";

function capitalizeName(name = "") {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
const BookingTab = () => {
  const param = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  // console.log("🚀 ~ Calender ~ driverId:", driverId);
  const userType = user?.user?.user_type;

  const [data, setData] = useState([]);
  console.log("🚀 ~ CustomerReports ~ data:", data);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");

  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null); // Track selected item for deletion
  const [deleteModal, setDeleteModal] = useState(false); // Track delete modal visibility
  const isSmallScreen = useIsSmallScreen();

  // Get today's date and start of the current month
  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];

  const [fromDate, setFromDate] = useState(""); // Initially empty
  console.log("🚀 ~ CustomerReports ~ fromDate:", fromDate);
  const [toDate, setToDate] = useState("");
  console.log("🚀 ~ CustomerReports ~ toDate:", toDate);
  const [customer, setCustomer] = useState([]);
  console.log("🚀 ~ CustomerReports ~ customer:", customer);

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

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
  const formatCurrency = (value) => {
    // Format currency to include commas
    const amount = parseFloat(value);
    const formattedAmount = Math.abs(amount)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return amount < 0 ? `-$${formattedAmount}` : `$${formattedAmount}`;
  };

  const handleDeleteClick = (item) => {
    setSelectedDeleteItem(item); // Set selected item for deletion
    toggleDeleteModal(); // Open delete modal
  };

  async function fetchPosts(customerId) {
    console.log("id1", customerId);
    setLoading(true);
    try {
      let response;
      if (userType === "DRIVER") {
        response = await PaymentService.getBookingList(customerId, driverId);
      } else {
        response = await PaymentService.getBookingList(customerId);
      }

      setData(response.data);
      setCustomer(response.data[0].customer);
      // console.log("Data...", data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts(param.id);
  }, []);

  const columns = [
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          S.N
        </div>
      ),
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },

    {
      name: "Appointment Date",
      selector: (row) => {
        // Extract and parse the date
        const date =
          row.sessions?.[0]?.start_time &&
          !isNaN(new Date(row.sessions[0].start_time).getTime())
            ? new Date(row.sessions[0].start_time)
            : null;

        // Format the date or show "Invalid Date"
        const formattedDate = date ? formatDateTime(date) : "Invalid Date";

        return (
          <>
            <Link
              to={`/appointment/detail/${row.id}`}
              className="btn btn-sm text-success"
            >
              <i
                className="ri-eye-line"
                style={{ fontWeight: "bold", fontSize: "16px" }}
              ></i>
            </Link>
            {formattedDate}
          </>
        );
      },
      sortable: true,
      center: true,
      wrap: true,
      grow: 2,
    },

    {
      name: "Package",
      selector: (row) => row?.package?.name || "",
      sortable: true,
      wrap:true
    },

    {
      name: "Instructor ",
      selector: (row) =>
        `${row?.driver?.user?.name || ""} ${row?.driver?.user?.surname || ""}`,
      sortable: true,
      omit: userType === "DRIVER",
      wrap: true,
    },
    {
      name: "Location",
      //   selector: (row) => row.pickup_location,
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
              {row.pickup_location || ""}
            </UncontrolledTooltip>
          )}
        </>
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
          Appointement Status
        </div>
      ),
      selector: (row) => (
        <span
          className={`badge ${
            appointmentStatusColor[row.appointment_status] || "bg-secondary"
          } text-uppercase text-white`}
        >
          {row.appointment_status || "No data available"}
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
          Payment Status
        </div>
      ),
      selector: (row) => (
        <span
          className={`badge ${
            statusColors[row.payment_status] || "bg-secondary"
          } text-uppercase text-white`}
        >
          {row.payment_status || "No data available"}
        </span>
      ),
      sortable: true,
    },
  ];

  console.log("🚀 ~ Data ~ Data:", data);

  const filteredData = data?.filter((item) => {
    const bookingDate = item.sessions[0]?.created_at
      ? new Date(item.sessions[0].created_at).toISOString().split("T")[0]
      : null;
    const isAfterFromDate = fromDate ? bookingDate >= fromDate : true;
    const isBeforeToDate = toDate ? bookingDate <= toDate : true;
    return isAfterFromDate && isBeforeToDate;
  });

  console.log("filteredData", filteredData);
  const exportToExcel = () => {
    // Map the filtered data to include only the fields you want to export
    const exportData = data?.map((item) => ({
      "Booking Date": new Date(
        item.sessions[0].created_at
      ).toLocaleDateString(),
      Package: item.package.name,
      Instructor: `${item.driver.user.name} ${item.driver.user.surname}`,
      Location: item.pickup_location,
      "Appointment Status": item.appointment_status,
      "Payment Status": item.payment_status,
    }));

    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add title at the top
    XLSX.utils.sheet_add_aoa(worksheet, [["COSMOS Driving School"]], {
      origin: "D2",
    });
    XLSX.utils.sheet_add_aoa(worksheet, [["117 John Whiteway Drive Gosford"]], {
      origin: "D3",
    });
    XLSX.utils.sheet_add_aoa(worksheet, [["Recong of Income statement"]], {
      origin: "D4",
    });

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          `Customer Name: ${capitalizeName(customer.name)} ${capitalizeName(
            customer.surname
          )}`,
        ],
      ],
      { origin: "A6" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`Phone Number: ${customer.phone_number}`]],
      { origin: "A7" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`Driving license no: ${customer.driving_license_no}`]],
      { origin: "A8" }
    );

    XLSX.utils.sheet_add_aoa(worksheet, [[`Email: ${customer.email}`]], {
      origin: "F8",
    });

    XLSX.utils.sheet_add_aoa(worksheet, [[`Address: ${customer.address}`]], {
      origin: "F6",
    });

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`Issuing Country: ${customer.issuing_country}`]],
      { origin: "F7" }
    );

    // Add column headers and data starting from the second row
    XLSX.utils.sheet_add_json(worksheet, exportData, {
      origin: "A10",
      skipHeader: false,
    });
    const range = XLSX.utils.decode_range(worksheet["!ref"]); // Get the range of the worksheet
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col }); // Get cell address
        if (!worksheet[cellAddress]) continue; // Skip if the cell doesn't exist
        worksheet[cellAddress].s = {
          border: {
            top: { style: "bold", color: { rgb: "000000" } },
            bottom: { style: "bold", color: { rgb: "000000" } },
            left: { style: "bold", color: { rgb: "000000" } },
            right: { style: "bold", color: { rgb: "000000" } },
          },
        };
      }
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    // Export the filtered data as an Excel file
    XLSX.writeFile(workbook, `Booking_Report_${customer.name}.xlsx`);
  };

  const jsDateToIso = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to month (0-indexed)
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <Row className="search-container mb-2 d-flex justify-content-end">
        <Col lg={6} className="my-auto "></Col>

        {/* <Col lg={4} md={9} className="mb-2 ">
          <div className="d-flex gap-2">
            <div className="mb-2">
              <Flatpickr
                type="text"
                placeholder="From Date"
                options={{
                  dateFormat: "d-m-Y",
                  allowInput: false,
                  disableMobile: true,
                }}
                onChange={(selectedDates) => {
                  setFromDate(jsDateToIso(selectedDates[0]));
                }}
                className="form-control"
              />
            </div>

            <div>
              <Flatpickr
                type="text"
                placeholder="To Date"
                options={{
                  altInput: true,
                  altFormat: "d-m-Y",

                  dateFormat: "Y-m-d",
                  allowInput: false,
                  minDate: fromDate,
                  disableMobile: true,
                }}
                onChange={(selectedDates) => {
                  setToDate(jsDateToIso(selectedDates[0]));
                }}
                className="form-control"
              />
            </div>
          </div>
        </Col> */}

        <Col lg={2} md={3}>
          <Button color="success" onClick={exportToExcel} className="w-100">
            <span className="d-none d-md-inline d-lg-none">Export</span>
            <span className="d-inline d-md-none d-lg-inline">
              Export to Excel
            </span>
          </Button>
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
            {filteredData && filteredData.length > 0 ? (
              <Row>
                {filteredData?.map((item, index) => (
                  <Col md={12} key={index} className="mb-1 smallScreen">
                    <Card>
                      <CardBody>
                        <CardTitle
                          tag="h5"
                          className="d-flex justify-content-between align-content-center align-items-center"
                        >
                          <div>
                            <strong>Appointment Date:</strong>{" "}
                            {formatDateTime(
                              item?.sessions[0]?.start_time || ""
                            )}
                          </div>
                          <Link
                            to={`/appointment/detail/${item.id}`}
                            className="text-success"
                          >
                            <i
                              className="ri-eye-line"
                              style={{ fontWeight: "bold", fontSize: "16px" }}
                            ></i>
                          </Link>
                        </CardTitle>

                        <CardText>
                          <strong>Package:</strong> {item?.package?.name || ""}
                        </CardText>

                        <CardText>
                          <strong>Instructor:</strong>{" "}
                          {item?.driver?.user.name || ""}{" "}
                          {item?.driver?.user?.surname || ""}
                        </CardText>
                        <CardText>
                          <strong>Location:</strong>{" "}
                          {item?.pickup_location || ""}
                        </CardText>

                        <CardText>
                          <strong>
                            Appointment Status:{" "}
                            <span
                              className={`badge ${
                                appointmentStatusColor[
                                  item?.appointment_status
                                ] || "bg-secondary"
                              } text-uppercase text-white`}
                            >
                              {item?.appointment_status || ""}
                            </span>
                          </strong>
                        </CardText>
                        <CardText>
                          <strong>Payment Status:</strong>{" "}
                          <span
                            className={`badge ${
                              statusColors[item?.payment_status] ||
                              "bg-secondary"
                            } text-uppercase text-white`}
                          >
                            {item?.payment_status}
                          </span>
                        </CardText>

                        {/* <div className="text-end">
                          <Button
                            color="danger"
                            className="rounded-circle btn-sm"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <i className="bx bx-trash"></i>
                          </Button>
                        </div> */}
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="d-flex justify-content-center my-3">
                <span>No Data Available</span>
              </div>
            )}
          </>
        )
      ) : (
        <div className="table-container">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={20}
            customStyles={{
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
            }}
            progressPending={loading}
            progressComponent={
              <div className="my-3">
                <Triangle
                  visible={true}
                  height="80"
                  width="80"
                  color="#5B71B9"
                  ariaLabel="triangle-loading"
                />
                <h5 className="mt-1">Loading...</h5>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default BookingTab;
