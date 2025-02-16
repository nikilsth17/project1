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
} from "reactstrap";
import classnames from "classnames";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import PaymentService from "../../../services/PaymentServices/PaymentService";
import PaymentDetailModal from "../../PaymentReportDetailModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import useIsSmallScreen from "../../Payment Type/Component/small screen/SmallScreen";
import { CustomerContext } from "../../../DibyaAdminPages/CustomerDetail/CustomerDetail";
import {
  formatDate,
  formatDateTime,
} from "../../../Components/Common/FormatDate";
import Flatpickr from "react-flatpickr";
import CustomerDetails from "./CustomerDetails";
import BookingTab from "./BookingTab";
import CustomerDetailDriver from "../Component/CustomerDetailDriver";

const GlobalFilter = ({ filterText, onFilter }) => (
  <Input
    type="text"
    placeholder="Search by customer name"
    value={filterText}
    onChange={onFilter}
    className="search-input me-2"
  />
);
function capitalizeName(name = "") {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
const CustomerReports = () => {
  const param = useParams();
  console.log("id", param.id);

  const [data, setData] = useState([]);
  console.log("🚀 ~ CustomerReports ~ data:", data);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [detailPayment, setDetailPayment] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null); // Track selected item for deletion
  const [deleteModal, setDeleteModal] = useState(false); // Track delete modal visibility
  const isSmallScreen = useIsSmallScreen();
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  // console.log("🚀 ~ Calender ~ driverId:", driverId);
  const userType = user?.user?.user_type;
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
  const [activeTab, setActiveTab] = useState("1");
  const [fromDate, setFromDate] = useState(""); // Initially empty
  console.log("🚀 ~ CustomerReports ~ fromDate:", fromDate);
  const [toDate, setToDate] = useState("");
  console.log("🚀 ~ CustomerReports ~ toDate:", toDate);
  const [customer, setCustomer] = useState([]);
  console.log("🚀 ~ CustomerReports ~ customer:", customer);

  const toggleDetailModal = () => setDetailModal(!detailModal);

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
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

  const handlePaymentTypeChange = (type) => {
    setSelectedPaymentType(type);
  };

  const handleViewDetails = (payment) => {
    setDetailPayment(payment);
    toggleDetailModal();
  };

  async function fetchPosts(customerId) {
    console.log("id1", customerId);
    setLoading(true);
    try {
      let response;
      if (userType === "DRIVER") {
        response = await PaymentService.getFiltered(customerId, driverId);
        console.log("🚀 ~ fetchPosts ~ responseDRiver:", response);
      } else {
        response = await PaymentService.getFiltered(customerId);
        console.log("🚀 ~ fetchPosts ~ response:", response);
      }

      setData(response);
      setCustomer(response.data[0].customer);

      if (response.dates) {
        // Set default dates from API if provided
        setFromDate(response.dates.start_date || firstDayOfMonth);
        setToDate(response.dates.end_date || today);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFilteredPosts(startDate, endDate, customerId) {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      let response;
      if (userType === "DRIVER") {
        response = await PaymentService.getListFiltered(
          startDate,
          endDate,
          customerId,
          driverId
        );
      } else {
        response = await PaymentService.getListFiltered(
          startDate,
          endDate,
          customerId
        );
      }

      setData(response);
      setCustomer(response.data[0].customer);
      if (response.dates) {
        setFromDate(response.dates.start_date || firstDayOfMonth);
        setToDate(response.dates.end_date || today);
      }
    } catch (error) {
      console.error("Error fetching filtered posts:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPosts(param.id);
  }, []);
  useEffect(() => {
    if (fromDate && toDate) {
      fetchFilteredPosts(fromDate, toDate, param.id); // Only call API if both dates are set
    }
  }, [fromDate, toDate]);
  // Filter data based on customer name, payment type, and date range
  const filteredData = data?.data?.filter((item) => {
    const matchesFilterText =
      item.customer.name &&
      item.customer.name.toLowerCase().includes(filterText.toLowerCase());

    const matchesPaymentType =
      selectedPaymentType === "" || item.payment_type === selectedPaymentType;

    // const transactionDate = new Date(item.payment_date);
    // const from = fromDate ? new Date(fromDate) : null;
    // const to = toDate ? new Date(toDate) : null;

    // Ensure date comparison only involves the date, not the time
    // const matchesDateRange =
    //   (!from ||
    //     transactionDate.setHours(0, 0, 0, 0) >= from.setHours(0, 0, 0, 0)) &&
    //   (!to || transactionDate.setHours(0, 0, 0, 0) <= to.setHours(0, 0, 0, 0));

    return matchesFilterText && matchesPaymentType;
  });

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
      width: "65px",
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
      selector: (row) =>
        `${row?.appointment?.driver?.user?.name || ""} ${
          row?.appointment?.driver?.user?.surname || ""
        }`,
      sortable: true,
      omit: userType === "DRIVER",
      wrap: true,
    },
    {
      name: "Event Date",

      selector: (row) =>
        row?.payment_date ? formatDateTime(row.payment_date) : "",
      sortable: true,
      wrap: true,
      grow: 2,
      
    },
    {
      name:(
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Activity
        </div>
      ),
      selector: (row) => row?.payment_type || "",
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
          Amount
        </div>
      ),
      selector: (row) => (parseFloat(row?.amount) || 0.0).toFixed(2),
      sortable: true,
      right: true,
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
          Discount
        </div>
      ),
      selector: (row) => (parseFloat(row?.discount_amount) || 0.0).toFixed(2),
      sortable: true,
      right: true,
    },
    {
      name: "Tip",
      selector: (row) => (parseFloat(row?.tip_amount) || 0.0).toFixed(2),
      sortable: true,
      right: true,
    },
    {
      name: "Net",
      selector: (row) =>
        (
          (parseFloat(row?.amount) || 0.0) +
          (parseFloat(row?.tip_amount) || 0.0) -
          (parseFloat(row?.discount_amount) || 0.0)
        ).toFixed(2),
      sortable: true,
      right: true,
    },
    {
      name: "Dr.",
      selector: (row) => (parseFloat(row?.total_amount) || 0.0).toFixed(2),
      sortable: true,
      right: true,
    },
    {
      name: "Cr.",
      selector: (row) => (
        <span className="">
          {(parseFloat(row?.received_amount) || 0.0).toFixed(2)}
        </span>
      ),
      sortable: true,
      right: true,
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
          Balance
        </div>
      ),
      selector: (row) => (
        <span className={row.balance < 0 ? "text-danger" : "text-success"}>
          {(parseFloat(row?.balance) || 0.0).toFixed(2)}
        </span>
      ),
      sortable: true,
      right: true,
    },
    ...(userType !== "DRIVER"
      ? [
          {
            name: "Actions",
            cell: (row) =>
              row.id !== "total" ? (
                <Button
                  color="danger"
                  className="rounded-circle btn-sm"
                  onClick={() => handleDeleteClick(row)}
                >
                  <i className="bx bx-trash"></i>
                </Button>
              ) : null,
            center: true,
            width: "120px",
          },
        ]
      : []),
  ];

  const safeData = Array.isArray(filteredData) ? filteredData : [];

  const totalRow = {
    id: "total",
    appointment: { driver: { user: { name: "Total", surname: "" } } },
    payment_date: "",
    payment_type: "",
    amount: safeData
      .reduce((sum, row) => sum + parseFloat(row?.amount || 0.0), 0.0)
      .toFixed(2),
    discount_amount: safeData
      .reduce((sum, row) => sum + parseFloat(row?.discount_amount || 0.0), 0.0)
      .toFixed(2),
    tip_amount: safeData
      .reduce((sum, row) => sum + parseFloat(row?.tip_amount || 0.0), 0.0)
      .toFixed(2),
    Net: safeData
      .reduce(
        (sum, row) =>
          sum +
          ((parseFloat(row?.amount) || 0.0) +
            (parseFloat(row?.tip_amount) || 0.0) -
            (parseFloat(row?.discount_amount) || 0.0)),
        0.0
      )
      .toFixed(2),
    total_amount: safeData
      .reduce((sum, row) => sum + parseFloat(row?.total_amount || 0.0), 0.0)
      .toFixed(2),
    received_amount: safeData
      .reduce((sum, row) => sum + parseFloat(row?.received_amount || 0.0), 0.0)
      .toFixed(2),
    balance: "",
  };

  // Append the totalRow at the end
  const modifiedData = [...safeData, totalRow];

  // console.log("🚀 ~ filteredData ~ filteredData:", filteredData);

  const exportToExcel = () => {
    // Map the filtered data to include only the fields you want to export
    const exportData =
      filteredData &&
      filteredData.map((item) => ({
        "Booking Date": new Date(
          item?.appointment?.sessions[0].created_at || ""
        ).toLocaleDateString(),
        "Payment Date": new Date(item?.payment_date || "").toLocaleDateString(),
        // Name: item.customer.name,
        Instructor: `${item?.appointment?.driver?.user?.name} ${item?.appointment?.driver?.user?.surname}`,
        Type: item?.payment_type || "",
        // "Ref.code": item.ref_code,
        Amount: formatCurrency(item?.amount || ""),
        GST: formatCurrency(item?.gst || ""),
        "Service Fee": formatCurrency(item?.service_fee || ""),
        Dr: formatCurrency(item?.total_amount || ""),
        Cr: formatCurrency(item?.received_amount || ""),
        Balance: formatCurrency(item?.balance || ""),
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
    XLSX.writeFile(workbook, `Payments_Report_${customer.name}.xlsx`);
  };

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      try {
        await PaymentService.delete(selectedDeleteItem.id); // Perform delete operation
        setData((prev) => ({
          ...prev,
          data: prev.data.filter((item) => item.id !== selectedDeleteItem.id),
        })); // Remove the deleted item from `data.data`
        setSelectedDeleteItem(null);
        toggleDeleteModal(); // Close modal
        toast.success("Record deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete the record");
      }
    }
  };

  const formatDateForDisplay = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const parseDateToISO = (formattedDate) => {
    const [day, month, year] = formattedDate.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleDateInputChange = (setter) => (e) => {
    const value = e.target.value;
    const regex = /^\d{0,2}-?\d{0,2}-?\d{0,4}$/; // Allows incomplete date during input
    if (regex.test(value)) {
      setter(value); // Temporarily store the unformatted value for editing
    }
  };
  const handleDateBlur = (setter) => (e) => {
    const value = e.target.value;
    const regex = /^\d{2}-\d{2}-\d{4}$/; // Matches complete DD-MM-YYYY format
    if (regex.test(value)) {
      setter(parseDateToISO(value)); // Convert to ISO format for storage
    } else {
      // Revert to the previous valid ISO value if input is invalid
      setter((prevDate) => prevDate);
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

  const totalAmount = safeData.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  const totalDiscount = safeData.reduce(
    (sum, item) => sum + (parseFloat(item.discount_amount) || 0),
    0
  );
  const totalTip = safeData.reduce(
    (sum, item) => sum + (parseFloat(item.tip_amount) || 0),
    0
  );
  const totalNet = totalAmount + totalTip - totalDiscount;
  const totalDebit = safeData.reduce(
    (sum, item) => sum + (parseFloat(item.total_amount) || 0),
    0
  );
  const totalCredit = safeData.reduce(
    (sum, item) => sum + (parseFloat(item.received_amount) || 0),
    0
  );
  const totalBalance = totalCredit - totalDebit;

  const summaryData = [
    { label: "Amount", value: totalAmount },
    { label: "Discount", value: totalDiscount },
    { label: "Tip", value: totalTip },
    { label: "Net", value: totalNet },
    { label: "Debit", value: totalDebit },
    { label: "Credit", value: totalCredit },
    { label: "Balance", value: totalBalance, isBalance: true },
  ];

  const cardBackgroundColor = {
    Cash: "bg-info",
    Card: "bg-warning",
    "Session Completed": "bg-success",
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb
          pageTitle="Customer Reports"
          title="Customer Reports"
          breadcrumbItems={[{ title: "Back To List ", link: "/customer" }]}
        />
      </div>

      {userType === "DRIVER" ? <CustomerDetailDriver /> : <CustomerDetails />}

      <Nav
        className="nav-tabs-custom rounded card-header-tabs border-bottom-0 mb-2"
        role="tablist"
      >
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => tabChange("1")}
          >
            Payment Reports
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => tabChange("2")}
          >
            Booking Reports
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row className="search-container mb-2 d-flex justify-content-end">
            <Col lg={6} className="my-auto ">
              {/* <InputGroup>
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
                {selectedPaymentType || "Filter by Type"}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handlePaymentTypeChange("")}>
                  All
                </DropdownItem>
                <DropdownItem onClick={() => handlePaymentTypeChange("Cash")}>
                  Cash
                </DropdownItem>
                <DropdownItem onClick={() => handlePaymentTypeChange("Card")}>
                  Card
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </InputGroup> */}
              {/* <h6>
            Customer Name: {capitalizeName(customer.name)}{" "}
            {capitalizeName(customer.surname)}
          </h6> */}
            </Col>
            {/* <Col lg={2} className="my-auto text-lg-end ">
          <h6>Filter by date range:</h6>
        </Col> */}
            {/* <Col lg={4} md={9} className="mb-2">
              <div className="d-flex gap-2">
                <div className="mb-2">
                  <Flatpickr
                    // value={isoToJsDate(fromDate)}
                    type="text"
                    placeholder="From Date"
                    options={{
                      dateFormat: "d-m-Y", // Display format: DD-MM-YYYY
                      disableMobile: true,
                      allowInput: false, // Disables manual input to only show the selected date
                    }}
                    onChange={(selectedDates) => {
                      const selectedDate = selectedDates[0];
                      setFromDate(jsDateToIso(selectedDate)); // Convert back to ISO (YYYY-MM-DD)
                    }}
                    className="form-control"
                  />
                </div>

                <div>
                  <Flatpickr
                    // value={isoToJsDate(toDate)}
                    type="text"
                    placeholder="To Date"
                    options={{
                      altInput: true,
                      altFormat: "d-m-Y",
                      // dateFormat: "d-m-Y", // Display format: DD-MM-YYYY
                      dateFormat: "Y-m-d", // Display format: DD-MM-YYYY
                      allowInput: false,
                      disableMobile: true,
                      minDate: fromDate, // Disables manual input to only show the selected date
                    }}
                    onChange={(selectedDates) => {
                      const selectedDate = selectedDates[0];
                      setToDate(jsDateToIso(selectedDate)); // Convert back to ISO (YYYY-MM-DD)
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
                    <Col>
                      <Row>
                        {summaryData.map(
                          ({ label, value, isBalance }, index) => (
                            <Col key={index}>
                              <Card className="">
                                <CardBody>
                                  <h6 className="d-flex justify-content-between">
                                    <strong>{label}:</strong>
                                    <br />
                                    <span
                                      className={
                                        isBalance
                                          ? value < 0
                                            ? "text-danger"
                                            : "text-success"
                                          : ""
                                      }
                                    >
                                      {parseFloat(value).toFixed(2)}
                                    </span>
                                  </h6>
                                </CardBody>
                              </Card>
                            </Col>
                          )
                        )}
                      </Row>
                    </Col>
                    {filteredData.map((item, index) => (
                      <Col md={12} key={index} className="mb-1 smallScreen">
                        <Card
                          className={`${
                            cardBackgroundColor[item?.payment_type] ||
                            "bg-secondary"
                          } bg-opacity-10`}
                        >
                          <CardBody>
                            <CardText>
                              <strong>Instructor: </strong>{" "}
                              {item?.appointment?.driver?.user?.name || ""}{" "}
                              {item?.appointment?.driver?.user?.surname || ""}
                            </CardText>
                            {/* <CardText>
                              <strong>Booking Date: </strong>{" "}
                              {formatDate(item?.appointment?.created_at || "")}
                            </CardText> */}
                            <CardText>
                              <strong>Event Date:</strong>{" "}
                              {formatDateTime(item?.payment_date || "")}
                            </CardText>

                            <CardText className="d-flex justify-content-between">
                              <strong>Activity Type:</strong>{" "}
                              {item?.payment_type || ""}
                            </CardText>

                            <CardText className="d-flex justify-content-between">
                              <strong>Amount:</strong>{" "}
                              {parseFloat(item?.amount || "").toFixed(2)}
                            </CardText>
                            <CardText className="d-flex justify-content-between">
                              <strong>Discount:</strong>{" "}
                              {parseFloat(item?.discount_amount || "").toFixed(
                                2
                              )}
                            </CardText>
                            <CardText className="d-flex justify-content-between">
                              <strong>Tip:</strong>{" "}
                              {parseFloat(item?.tip_amount || "").toFixed(2)}
                            </CardText>
                            <CardText className="d-flex justify-content-between">
                              <strong>Net:</strong>{" "}
                              {(
                                parseFloat(item?.amount || 0) +
                                parseFloat(item?.tip_amount || 0) -
                                parseFloat(item?.discount || 0)
                              ).toFixed(2)}
                            </CardText>

                            <CardText className="d-flex justify-content-between">
                              <strong>Total Amount(Dr.):</strong>{" "}
                              {parseFloat(item?.total_amount || "").toFixed(2)}
                            </CardText>
                            <CardText className="d-flex justify-content-between">
                              <strong>Received Amount(Cr.):</strong>{" "}
                              <span>
                                {parseFloat(
                                  item?.received_amount || ""
                                ).toFixed(2)}
                              </span>
                            </CardText>
                            <CardText className="d-flex justify-content-between">
                              <strong>Balance:</strong>{" "}
                              <span
                                className={
                                  item?.balance < 0
                                    ? "text-danger"
                                    : "text-success"
                                }
                              >
                                {parseFloat(item?.balance || "").toFixed(2)}
                              </span>
                            </CardText>
                            {userType === "DRIVER" ? null : (
                              <div className="text-end">
                                <Button
                                  color="danger"
                                  className="rounded-circle btn-sm"
                                  onClick={() => handleDeleteClick(item)}
                                >
                                  <i className="bx bx-trash"></i>
                                </Button>
                              </div>
                            )}
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
                data={modifiedData}
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
        </TabPane>

        <TabPane tabId="2">
          <BookingTab />
        </TabPane>
      </TabContent>
      <PaymentDetailModal
        isOpen={detailModal}
        toggle={toggleDetailModal}
        paymentDetails={detailPayment}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
      />
    </div>
  );
};

export default CustomerReports;
