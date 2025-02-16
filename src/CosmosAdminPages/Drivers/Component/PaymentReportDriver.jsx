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
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import useIsSmallScreen from "../../Payment Type/Component/small screen/SmallScreen";
import {
  formatDate,
  formatDateTime,
} from "../../../Components/Common/FormatDate";
import Flatpickr from "react-flatpickr";
import PaymentService from "../../../services/PaymentServices/PaymentService";
import DeleteModal from "../../../Components/Common/DeleteModal";

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
const PaymentReportDriver = () => {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);

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
  // console.log("🚀 ~ CustomerReports ~ fromDate:", fromDate);
  const [toDate, setToDate] = useState("");
  // console.log("🚀 ~ CustomerReports ~ toDate:", toDate);
  const [customer, setCustomer] = useState([]);
  // console.log("🚀 ~ CustomerReports ~ customer:", customer);

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

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      console.log(
        "🚀 ~ handleDelete ~ selectedDeleteItem:",
        selectedDeleteItem
      );
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
      const response = await PaymentService.getPaidList(id);
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
      const response = await PaymentService.getPaidListFiltered({
        driver: id,
      });

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

  async function fetchExcelFilteredPosts(startDate, endDate, customerId) {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const response = await PaymentService.getPaidListFiltered({
        driver: id,
      });

      setExcelData(response);
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
    fetchPosts(id);
  }, []);
  useEffect(() => {
    if (fromDate && toDate) {
      fetchFilteredPosts(fromDate, toDate, id); // Only call API if both dates are set
      fetchExcelFilteredPosts(fromDate, toDate, id);
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
      selector: (row) => formatDate(row.payment_date),
      sortable: true,
    },
    // {
    //   name: "Name",
    //   selector: (row) => row.customer.name,
    //   sortable: true,
    //   width: "130px",
    //   cell: (row) => (
    //     <span
    //       className="clickable-name"
    //       onClick={() => handleViewDetails(row)}
    //       style={{
    //         cursor: "pointer",
    //         color: "blue",
    //       }}
    //     >
    //       {row.customer.name}
    //     </span>
    //   ),
    // },
    {
      name: "Type",
      selector: (row) => row.payment_type,
      sortable: true,
    },

    // {
    //   name: "Ref.code",
    //   selector: (row) => row.ref_code,
    //   sortable: true,
    //   // width: "100px",
    // },

    {
      name: "Amount",
      selector: (row) => formatCurrency(row.amount),
      sortable: true,

      right: true,
    },
    // {
    //   name: "GST",
    //   selector: (row) => formatCurrency(row.gst),
    //   sortable: true,
    //   width: "150px",
    //   right: true,
    // },
    // {
    //   name: "Service Fee",
    //   selector: (row) => formatCurrency(row.service_fee),
    //   sortable: true,
    //   width: "150px",
    //   right: true,
    // },
    // {
    //   name: "Dr.",
    //   selector: (row) => formatCurrency(row.total_amount),
    //   sortable: true,
    //   width: "150px",
    //   right: true,
    // },
    {
      name: "Cr.",
      selector: (row) => formatCurrency(row.received_amount),
      sortable: true,

      right: true,
    },
    // {
    //   name: "Balance",
    //   selector: (row) => formatCurrency(row.balance),
    //   sortable: true,
    //   width: "150px",
    //   right: true,
    // },
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
    },
  ];

  // Filter data based on customer name, payment type, and date range
  const filteredData = data.data?.filter((item) => {
    const matchesFilterText =
      item.customer.name &&
      item.customer.name.toLowerCase().includes(filterText.toLowerCase());

    const matchesPaymentType =
      selectedPaymentType === "" || item.payment_type === selectedPaymentType;

    const transactionDate = new Date(item.payment_date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    // Ensure date comparison only involves the date, not the time
    const matchesDateRange =
      (!from ||
        transactionDate.setHours(0, 0, 0, 0) >= from.setHours(0, 0, 0, 0)) &&
      (!to || transactionDate.setHours(0, 0, 0, 0) <= to.setHours(0, 0, 0, 0));

    return matchesFilterText && matchesPaymentType && matchesDateRange;
  });
  console.log("🚀 ~ filteredData ~ filteredData:", filteredData);

  const exportToExcel = () => {
    // Map the filtered data to include only the fields you want to export
    const exportData = excelData?.data?.map((item) => ({
      "Transaction Date": new Date(item.payment_date).toLocaleDateString(),
      Name: item.customer.name,
      Type: item.payment_type,
      "Ref.code": item.ref_code,
      Amount: formatCurrency(item.amount),
      GST: formatCurrency(item.gst),
      "Service Fee": formatCurrency(item.service_fee),
      Dr: formatCurrency(item.total_amount),
      Cr: formatCurrency(item.received_amount),
      Balance: formatCurrency(item.balance),
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

  const parseDateToISO = (formattedDate) => {
    const [day, month, year] = formattedDate.split("-");
    return `${year}-${month}-${day}`;
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

  return (
    <div>
      <Row className="search-container mb-2">
        <Col lg={4} className="my-auto "></Col>
        <Col lg={2} className="my-auto text-lg-end ">
          <h6>Filter by date range:</h6>
        </Col>
        <Col lg={4} md={9} className="mb-2">
          <div className="d-flex gap-2">
            {/* From Date Picker */}
            <div className="mb-2">
              <Flatpickr
                // value={isoToJsDate(fromDate)} // Convert ISO to JS Date object
                options={{
                  dateFormat: "d-m-Y", // Display format: DD-MM-YYYY
                  allowInput: false, // Disables manual input to only show the selected date
                }}
                onChange={(selectedDates) => {
                  const selectedDate = selectedDates[0];
                  setFromDate(jsDateToIso(selectedDate)); // Convert back to ISO (YYYY-MM-DD)
                }}
                className="form-control"
              />
            </div>

            {/* To Date Picker */}
            <div>
              <Flatpickr
                // value={isoToJsDate(toDate)} // Convert ISO to JS Date object
                options={{
                  dateFormat: "d-m-Y", // Display format: DD-MM-YYYY
                  allowInput: false, // Disables manual input to only show the selected date
                }}
                onChange={(selectedDates) => {
                  const selectedDate = selectedDates[0];
                  setToDate(jsDateToIso(selectedDate)); // Convert back to ISO (YYYY-MM-DD)
                }}
                className="form-control"
              />
            </div>
          </div>
        </Col>

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
                {filteredData.map((item, index) => (
                  <Col md={12} key={index} className="mb-1 smallScreen">
                    <Card>
                      <CardBody>
                        <CardTitle tag="h5">
                          <strong>Payment Date:</strong>{" "}
                          {formatDateTime(item.payment_date)}
                        </CardTitle>
                        <CardText>
                          <strong>Name: </strong> {item.customer.name}
                        </CardText>
                        <CardText>
                          <strong>Payment Type:</strong> {item.payment_type}
                        </CardText>
                        {/* <CardText>
                          <strong>Ref.code:</strong> {item.ref_code}
                        </CardText> */}
                        <CardText>
                          <strong>Amount:</strong> {item.amount}
                        </CardText>
                        <CardText>
                          <strong>GST:</strong> {item.gst}
                        </CardText>
                        <CardText>
                          <strong>Service Fee:</strong> {item.service_fee}
                        </CardText>
                        <CardText>
                          <strong>Total Amount(Dr.):</strong>{" "}
                          {item.total_amount}
                        </CardText>
                        <CardText>
                          <strong>Received Amount(Cr.):</strong>{" "}
                          {item.received_amount}
                        </CardText>
                        <div className="text-end">
                          <Button
                            color="danger"
                            className="rounded-circle btn-sm"
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
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem} // Pass the selected item
      />
    </div>
  );
};

export default PaymentReportDriver;
