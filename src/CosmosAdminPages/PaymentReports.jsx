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
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import "./PaymentReports.css";
import * as XLSX from "xlsx";
import PaymentService from "../services/PaymentServices/PaymentService";
import PaymentDetailModal from "./PaymentReportDetailModal";
import DeleteModal from "../Components/Common/DeleteModal";
import toast from "react-hot-toast";
import BreadCrumb from "../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import useIsSmallScreen from "./Payment Type/Component/small screen/SmallScreen";
import { formatDate, formatDateTime } from "../Components/Common/FormatDate";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import DriverServices from "../services/DriverServices/DriverServices";

const GlobalFilter = ({ filterText, onFilter }) => (
  <Input
    type="text"
    placeholder="Search by customer name"
    value={filterText}
    onChange={onFilter}
    className="search-input me-2"
  />
);

const PaymentsReport = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  // console.log("🚀 ~ Calender ~ driverId:", driverId);
  const userType = user?.user?.user_type;

  const [data, setData] = useState([]);
  console.log("🚀 ~ PaymentsReport ~ data:", data);
  const [excelData, setExcelData] = useState([]);
  console.log("🚀 ~ PaymentsReport ~ excelData:", excelData);

  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [detailPayment, setDetailPayment] = useState(null);
  // console.log("🚀 ~ PaymentsReport ~ detailPayment:", detailPayment);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null); // Track selected item for deletion
  // console.log("🚀 ~ PaymentsReport ~ selectedDeleteItem:", selectedDeleteItem);
  const [deleteModal, setDeleteModal] = useState(false); // Track delete modal visibility
  const isSmallScreen = useIsSmallScreen();
  const [driverData, setDriverData] = useState([]);

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
    { value: "all", label: "All Instructor" }, // Manually added option
    ...(driverData?.map((item) => ({
      value: item.id,
      label: `${item.name} ${item.surname}`,
    })) || []), // Existing options from driverData
  ];

  const [selectedDriver, setSelectedDriver] = useState(
    driverOptions.find((option) => option.value === "all") // Default to "All"
  );
  const handleDriverChange = (selectedOption) => {
    setSelectedDriver(
      selectedOption || driverOptions.find((option) => option.value === "all")
    );
    // console.log("Selected Driver:", selectedOption);
  };

  // Get today's date and start of the current month
  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];

  // const [fromDate, setFromDate] = useState(firstDayOfMonth);
  // const [toDate, setToDate] = useState(today);
  const [fromDate, setFromDate] = useState(""); // Initially empty
  const [toDate, setToDate] = useState("");

  const toggleDetailModal = () => setDetailModal(!detailModal);

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

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

  const handlePaymentTypeChange = (type) => {
    setSelectedPaymentType(type);
  };

  const handleViewDetails = (payment) => {
    setDetailPayment(payment);
    toggleDetailModal();
  };

  async function fetchPosts() {
    setLoading(true);
    try {
      let response;
      if (userType === "DRIVER") {
        response = await PaymentService.getPaidList(driverId); // Fetch data for DRIVER
      } else {
        response = await PaymentService.getPaidList(); // Fetch data for others
      }

      setData(response); // Set the fetched data

      // Handle dates if provided in the response
      if (response.dates) {
        const { start_date, end_date } = response.dates;
        setFromDate(start_date || firstDayOfMonth);
        setToDate(end_date || today);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  }

  // async function fetchFilteredPosts(startDate, endDate) {
  //   if (!startDate || !endDate) {
  //     console.warn("Start date and end date are required.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     let response;
  //     if (userType === "DRIVER") {
  //       response = await PaymentService.getPaidListFiltered(
  //         startDate,
  //         endDate,
  //         driverId
  //       );
  //     } else {
  //       response = await PaymentService.getPaidListFiltered(startDate, endDate);
  //     }

  //     setData(response);

  //     // Handle dates from the response if provided
  //     if (response.dates) {
  //       const { start_date, end_date } = response.dates;
  //       setFromDate(start_date || firstDayOfMonth);
  //       setToDate(end_date || today);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching filtered posts:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function fetchFilteredExcel(startDate, endDate) {
    if (!startDate || !endDate) {
      console.warn("Start date and end date are required.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (userType === "DRIVER") {
        response = await PaymentService.getPaymentListFiltered(
          startDate,
          endDate,
          driverId
        );
      } else {
        response = await PaymentService.getListFiltered(startDate, endDate);
      }

      setExcelData(response);

      // Handle dates from the response if provided
      if (response.dates) {
        const { start_date, end_date } = response.dates;
        setFromDate(start_date || firstDayOfMonth);
        setToDate(end_date || today);
      }
    } catch (error) {
      console.error("Error fetching filtered posts:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    if (fromDate && toDate) {
      // fetchFilteredPosts(fromDate, toDate); // Only call API if both dates are set
      fetchFilteredExcel(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: "Payment Date",
      selector: (row) => `${formatDateTime(row.payment_date)}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) =>
        `${row.customer?.name} ${" "} ${row.customer?.surname}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Instructor",
      selector: (row) =>
        `${row.appointment?.driver?.user?.name || ""}${" "}
        ${row.appointment?.driver?.user?.surname || ""}`,
      sortable: true,
      wrap: true,
      omit: userType === "DRIVER", // Hide if userType is "DRIVER"
    },
    {
      name: "Type",
      selector: (row) =>
        row.payment_type === "Card" ? "Credit Card" : row.payment_type,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => formatCurrency(row.received_amount),
      sortable: true,
      right: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          color="danger"
          className="rounded-circle btn-sm"
          onClick={() => handleDeleteClick(row)} // Open delete modal
        >
          <i className="bx bx-trash"></i>
        </Button>
      ),
      center: true,
      omit: userType === "DRIVER", // Hide if userType is "DRIVER"
    },
  ];

  // Filter data based on customer name, payment type, and date range
  const filteredData = data.data
    ?.filter((item) => {
      // console.log("🚀 ~ ?.filter ~ item:", item);
      const matchesFilterText =
        item?.customer?.name &&
        item?.customer?.name.toLowerCase().includes(filterText.toLowerCase());

      // const matchesPaymentType =
      //   selectedPaymentType === "" ||
      //   item?.payment_type === selectedPaymentType;
      const matchesPaymentType =
        selectedPaymentType === "" ||
        selectedPaymentType === "All" ||
        (item?.payment_type === "Card" ? "Credit Card" : item?.payment_type) ===
          selectedPaymentType;

      const transactionDate = new Date(item?.payment_date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      // Ensure date comparison only involves the date, not the time
      const matchesDateRange =
        (!from ||
          transactionDate.setHours(0, 0, 0, 0) >= from.setHours(0, 0, 0, 0)) &&
        (!to ||
          transactionDate.setHours(0, 0, 0, 0) <= to.setHours(0, 0, 0, 0));

      const matchesDriver =
        selectedDriver?.value === "all"
          ? true // Show all events when "All" is selected
          : item?.appointment?.driver_id === selectedDriver?.value;

      return (
        matchesFilterText &&
        matchesPaymentType &&
        matchesDateRange &&
        matchesDriver
      );
    })
    .reverse();

  const exportToExcel = () => {
    // Map the filtered data to include only the fields you want to export
    const exportData = excelData?.data?.map((item) => ({
      "Transaction Date": new Date(item.payment_date).toLocaleDateString(),
      Name: item.customer?.name + " " + item.customer?.surname,

      // Type: item?.payment_type,
      Type: item?.payment_type === "Card" ? "Credit Card" : item?.payment_type,

      Amount: formatCurrency(item?.amount),
      GST: formatCurrency(item?.gst),
      "Service Fee": formatCurrency(item?.service_fee),
      Dr: formatCurrency(item?.total_amount),
      Cr: formatCurrency(item?.received_amount),
      // "Balance": formatCurrency(item.balance),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    // Export the filtered data as an Excel file
    XLSX.writeFile(workbook, "Payments_Report.xlsx");
  };

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      // console.log(
      //   "🚀 ~ handleDelete ~ selectedDeleteItem:",
      //   selectedDeleteItem
      // );
      try {
        await PaymentService.delete(selectedDeleteItem?.id); // Perform delete operation
        // setData((prev) =>
        //   prev.filter((item) => item.id !== selectedDeleteItem?.appointment?.id)
        // );
        setData((prev) => ({
          ...prev,
          data: prev.data.filter((item) => item.id !== selectedDeleteItem?.id),
        }));
        setSelectedDeleteItem(null);
        toggleDeleteModal(); // Close modal
        toast.success("Record deleted successfully");
        fetchPosts();
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete the record");
      }
    }
  };

  // Function to convert ISO date to JavaScript Date object
  const isoToJsDate = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return new Date(year, month - 1, day); // Month is 0-indexed
  };

  // Function to format JavaScript Date to ISO date (YYYY-MM-DD)
  const jsDateToIso = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to month (0-indexed)
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (filteredData?.length > 0) {
      const newTotal = filteredData.reduce(
        (sum, row) => sum + Number(row.received_amount || 0),
        0
      );
      console.log("🚀 ~ Updated Total Amount based on Filters:", newTotal);
      setTotalAmount(newTotal);
    } else {
      setTotalAmount(0);
    }
  }, [filteredData]); // Depend on filteredData to recalculate

  // Recalculate totalAmount when data updates

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Payment reports list" pageTitle="Payment reports" />
      </div>
      <Row className="search-container mb-2">
        <Col lg={4} className="mb-2">
          <InputGroup>
            <GlobalFilter
              filterText={filterText}
              onFilter={(e) => setFilterText(e.target.value)}
            />
            <Dropdown
              isOpen={isOpen}
              toggle={() => setIsOpen(!isOpen)}
              className="ms-2 p-5"
            >
              <DropdownToggle caret>
                {selectedPaymentType || "Payment Type"}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handlePaymentTypeChange("All")}>
                  All
                </DropdownItem>
                <DropdownItem onClick={() => handlePaymentTypeChange("Cash")}>
                  Cash
                </DropdownItem>
                <DropdownItem
                  onClick={() => handlePaymentTypeChange("Credit Card")}
                >
                  Credit Card
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </InputGroup>
        </Col>
        {/* <Col lg={2} className="my-auto text-lg-end ">
          <h6>Filter by date range:</h6>
        </Col> */}
        <Col lg={3} md={9} xs={12} className="mb-2">
          <Row>
            <Col xs={6}>
              <Flatpickr
                type="text"
                placeholder="From Date"
                // value={isoToJsDate(fromDate)} // Convert ISO to JS Date object
                options={{
                  dateFormat: "d-m-Y", // Display format: DD-MM-YYYY
                  disableMobile: true, // Force Flatpickr UI on mobile
                }}
                onChange={(selectedDates) => {
                  const selectedDate = selectedDates[0];
                  setFromDate(jsDateToIso(selectedDate)); // Convert back to ISO (YYYY-MM-DD)
                }}
                className="form-control"
              />
            </Col>
            <Col xs={6}>
              <Flatpickr
                type="text"
                placeholder="To Date"
                // value={isoToJsDate(toDate)} // Convert ISO to JS Date object
                options={{
                  altInput: true,
                  altFormat: "d-m-Y",
                  // dateFormat: "d-m-Y", // Display format: DD-MM-YYYY
                  dateFormat: "Y-m-d", // Display format: DD-MM-YYYY
                  minDate: fromDate,
                  disableMobile: true, // Force Flatpickr UI on mobile
                }}
                onChange={(selectedDates) => {
                  const selectedDate = selectedDates[0];
                  setToDate(jsDateToIso(selectedDate)); // Convert back to ISO (YYYY-MM-DD)
                }}
                className="form-control"
              />
            </Col>
          </Row>
        </Col>

        {userType !== "DRIVER" && (
          <Col lg={3} md={6} className="mb-2">
            {/* <p className="fs-5 text-center mb-0">Driver</p> */}
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
                value={selectedDriver} // Dynamically reflects the selected option
                onChange={handleDriverChange}
                placeholder="Select a driver"
                // isClearable
                isClearable={selectedDriver?.value !== "all"}
                menuPortalTarget={document.body} // Renders the menu in the body
                styles={{
                  control: (base) => ({
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
        )}

        <Col lg={2} md={3}>
          <Button
            color="success"
            onClick={exportToExcel}
            className="w-100 mb-3"
          >
            <span className="d-none d-md-inline d-lg-none">Export</span>
            <span className="d-inline d-md-none d-lg-inline">
              Export to Excel
            </span>
          </Button>
        </Col>

        {/* <Col lg={4} md={6}>
        <Select
              options={driverOptions}
              value={selectedDriver}
              onChange={handleDriverChange}
              placeholder="Select a driver"
              isClearable
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
        </Col> */}
      </Row>
      <Card className="p-2">
        <Row className="m-1">
          <Col
            md={9}
            xs={8}
            className="d-flex justify-content-end align-items-end align-content-end"
          >
            <h6>Total Amount:</h6>
          </Col>
          <Col
            md={3}
            xs={4}
            className="d-flex justify-content-end align-items-end align-content-end"
          >
            <h6 className="fs-6 fw-bold">{formatCurrency(totalAmount)}</h6>
          </Col>
        </Row>
      </Card>
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
                {filteredData.map((item, index) => (
                  <Col md={12} key={index} className="mb-1 smallScreen">
                    <Card>
                      <CardBody>
                        <CardText>
                          <strong>Payment Date:</strong>{" "}
                          {formatDateTime(item.payment_date)}
                        </CardText>
                        <CardText>
                          <strong>Name: </strong> {item.customer.name}{" "}
                          {item.customer.surname}
                        </CardText>
                        <CardText>
                          {/* <strong>Payment Type:</strong> {item.payment_type} */}
                          <strong>Payment Type:</strong>{" "}
                          {item.payment_type === "Card"
                            ? "Credit Card"
                            : item.payment_type}
                        </CardText>
                        <CardText>
                          <strong>Instructor:</strong>{" "}
                          {item?.appointment?.driver?.user?.name || ""}{" "}
                          {item.appointment?.driver?.user?.surname || ""}
                        </CardText>
                        <CardText>
                          <strong>Type:</strong> {item?.payment_type || ""}
                        </CardText>
                        {/* <CardText className="d-flex justify-content-between">
                          <strong>Amount:</strong> {formatCurrency(item.amount)}
                        </CardText> */}
                        {/* <CardText className="d-flex justify-content-between">
                          <strong>GST:</strong> {formatCurrency(item.gst)}
                        </CardText> */}
                        {/* <CardText className="d-flex justify-content-between">
                          <strong>Service Fee:</strong>{" "}
                          {formatCurrency(item.service_fee)}
                        </CardText> */}
                        <CardText className="d-flex justify-content-between">
                          <strong>Amount:</strong>{" "}
                          {formatCurrency(item.received_amount)}
                        </CardText>
                        {/* <CardText className="d-flex justify-content-between">
                          <strong>Received Amount(Cr.):</strong>{" "}
                          {formatCurrency(item.received_amount)}
                        </CardText> */}
                        <div className="text-end">
                          <Button
                            color="danger"
                            className="rounded-circle btn-sm "
                            onClick={() => handleDeleteClick(item)}
                          >
                            <i className="bx bx-trash"></i>
                          </Button>
                        </div>
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

      <PaymentDetailModal
        isOpen={detailModal}
        toggle={toggleDetailModal}
        paymentDetails={detailPayment}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem} // Pass the selected item
      />
    </div>
  );
};

export default PaymentsReport;
