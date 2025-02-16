import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "reactstrap";
import * as XLSX from "xlsx";
import { Triangle } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomDataTable from "../../../Components/CustomTable/CustomTable";
import CustomerServices from "../../../services/CustomerServices/CustomerServices";
import DeleteModal from "../../../Components/Common/DeleteModal";
import toast from "react-hot-toast";
import useIsSmallScreen from "../../Payment Type/Component/small screen/SmallScreen";
import Select from "react-select";
import DriverServices from "../../../services/DriverServices/DriverServices";
import AddCustomer from "../Component/AddCustomer";
import UpdatedPagination from "../../../Components/Common/UpdatedPagination";
import DataTable from "react-data-table-component";

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

const CustomerList = ({ onFilter }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  // console.log("🚀 ~ Calender ~ driverId:", driverId);
  const userType = user?.user?.user_type;

  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  // console.log("editingPackage", editingPackage);

  const [dataList, setDataList] = useState([]);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  // console.log("🚀 ~ CustomerList ~ selectedDeleteItem:", selectedDeleteItem);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [driverData, setDriverData] = useState([]);
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedDetail, setSelectedDetail] = useState([]);
  const toggleModal = () => setModal(!modal);

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

  const handleDriverChange = (selectedOption) => {
    setSelectedDriver(
      selectedOption || driverOptions.find((option) => option.value === "all")
    );
    // console.log("Selected Driver:", selectedOption);
  };

  const [selectedDriver, setSelectedDriver] = useState(
    driverOptions.find((option) => option.value === "all") // Default to "All"
  );

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      // console.log(
      //   "🚀 ~ handleDelete ~ selectedDeleteItem:",
      //   selectedDeleteItem
      // );
      try {
        await CustomerServices.delete(selectedDeleteItem);
        setDataList((prevList) =>
          prevList.filter((pkg) => pkg.id !== selectedDeleteItem)
        );
        toast.success("Selected customer deleted successfully");
      } catch (error) {
        toast.error("Failed to delete the record");
      } finally {
        toggleDeleteModal();
        setSelectedDeleteItem(null);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const filteredPackages = dataList.filter((pkg) => {
    // console.log("🚀 ~ filteredPackages ~ pkg:", pkg);

    // Combine name, surname, email, and phone number into a single search context, handling undefined fields
    const searchContext = `${pkg?.name || ""} ${pkg?.surname || ""} ${
      pkg?.email || ""
    } ${pkg?.phone_number || ""}`.toLowerCase();

    // Check if the filterText is included in any of the search context
    const matchesFilter = searchContext.includes(filterText.toLowerCase());

    // console.log("🚀 ~ filteredPackages ~ matchesFilter:", matchesFilter);

    const matchesDriver =
      selectedDriver?.value === "all"
        ? true // Show all events when "All" is selected
        : pkg?.drivers?.some((driver) => driver.id === selectedDriver?.value);

    return matchesFilter && matchesDriver;
  });

  async function fetchCustomers() {
    setLoading(true);
    try {
      let response;
      if (userType === "DRIVER") {
        response = await CustomerServices.getList();
        // console.log("🚀 ~ fetchCustomers ~ response:", response);
      } else {
        response = await CustomerServices.getList();
      }

      setDataList(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleDeleteClick = (item) => {
    setSelectedDeleteItem(item);
    toggleDeleteModal();
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
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
      selector: (row) => (
        <div>
          {row.name} {row.surname}
        </div>
      ),
      sortable: true,
      wrap: true,
    },
    ...(userType !== "DRIVER"
      ? [
          {
            name: "Instructor",
            selector: (row) =>
              row?.drivers
                ?.map(
                  (driver) => `${driver.name || ""} ${driver.surname || ""}`
                )
                .join(", "), // Returns a plain text value
            cell: (row) => (
              <div>
                {row?.drivers &&
                  row.drivers.map((driver, index) => (
                    <div key={driver.id || index}>
                      {driver.name || ""} {driver.surname || ""}
                    </div>
                  ))}
              </div>
            ),
            sortable: false, // Sorting might not work well with multiple names
            wrap: true,
          },
        ]
      : []),

    {
      name: "Email",
      selector: (row) => row.email,
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
          Driving License
        </div>
      ),
      selector: (row) => row.driving_license_no,
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
          Phone Number
        </div>
      ),
      selector: (row) => {
        let phoneNumber = row.phone_number; // Ensure it's a string and remove extra spaces
        // console.log("🚀 ~ CustomerList ~ phoneNumber:", phoneNumber);

        if (/^[1-9]\d{8}$/.test(phoneNumber)) {
          return `0${phoneNumber}`; // If it's 9 digits (not starting with 0), add a leading 0
        } else if (/^0\d{9}$/.test(phoneNumber)) {
          return phoneNumber; // If it's already valid (10 digits starting with 0), return as is
        } else {
          return "Invalid Number"; // If it doesn't match either format, show an error message
        }
      },
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <ButtonGroup className="gap-1">
          <Button
            color="success"
            className="btn-sm"
            onClick={() => navigate(`/customer/detail/${row.id}`)}
          >
            View Report
          </Button>

          {userType === "DRIVER" ? null : (
            <>
              <Button
                color="warning"
                className="rounded-circle btn-sm"
                onClick={() => {
                  setAddModal(true);
                  setEditingPackage(row);
                }}
              >
                <i className="bx bx-edit"></i>
              </Button>
              <Button
                color="danger"
                className="rounded-circle btn-sm "
                onClick={() => handleDeleteClick(row.id)} // Wrap the function call in an arrow function
              >
                <i className="bx bx-trash" />
              </Button>
            </>
          )}
        </ButtonGroup>
      ),
      center: true,
      width: "20%",
    },
  ];

  // Pagination logic for small screens
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredPackages.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Customer List" pageTitle="Customer" />
      </div>
      <Row className="">
        <Col md={5} className="mb-2">
          <InputGroup>
            <Input
              placeholder="Search by name, email, driving license, and phone number"
              value={filterText}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Col>
        {userType === "DRIVER" ? (
          <Col md={3}></Col>
        ) : (
          <Col md={3} className="mb-2">
            <div style={{ position: "relative" }}>
              <i
                className="bx bx-user"
                style={{
                  position: "absolute",
                  left: "5px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#6c757d",
                  fontSize: "16px",
                  zIndex: 999,
                }}
              />
              <Select
                options={driverOptions}
                value={selectedDriver}
                onChange={handleDriverChange}
                placeholder="Select a driver"
                isClearable={selectedDriver?.value !== "all"}
                menuPortalTarget={document.body}
                styles={{
                  control: (base) => ({
                    ...base,
                    paddingLeft: "25px",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 1050,
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
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

        {/* {userType === "DRIVER" ? null : ( */}
        <Col
          md={4}
          xs={12}
          className="d-flex justify-content-end align-items-end mb-2"
        >
          <Button
            className="package-button px-1 px-sm-2"
            onClick={() => setAddModal(true)}
          >
            Add New Customer
          </Button>
        </Col>
        {/* // )} */}
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
            <Row>
              {currentItems.map((item, index) => (
                <Col md={12} key={index} className="mb-1 smallScreen">
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">
                        <strong>Customer: </strong>
                        {item.name} {item.surname}
                      </CardTitle>
                      {userType === "DRIVER" ? null : (
                        <CardText>
                          <strong>
                            Instructor:{" "}
                            {item?.drivers &&
                              item?.drivers
                                .map(
                                  (driver) =>
                                    `${driver.name || ""} ${
                                      driver.surname || ""
                                    }`
                                )
                                .join(", ")}
                          </strong>
                        </CardText>
                      )}
                      <CardText>
                        <strong>Email: </strong> {item.email}
                      </CardText>
                      <CardText>
                        <strong>Driving License: </strong>{" "}
                        {item.driving_license_no}
                      </CardText>
                      <CardText>
                        <strong>Phone Number: </strong> {item.phone_number}
                      </CardText>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          color="success"
                          className="btn-sm gap-1"
                          onClick={() =>
                            navigate(`/customer/detail/${item.id}`)
                          }
                        >
                          View Report
                        </Button>

                        {userType === "DRIVER" ? null : (
                          <>
                            <Button
                              color="warning"
                              className="rounded-circle btn-sm"
                              onClick={() => {
                                setAddModal(true);
                                setEditingPackage(item);
                              }}
                            >
                              <i className="bx bx-edit"></i>
                            </Button>
                            <Button
                              color="danger"
                              className="rounded-circle btn-sm"
                              onClick={() => handleDeleteClick(item.id)}
                            >
                              <i className="bx bx-trash" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
            <UpdatedPagination
              data={filteredPackages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              perPageData={rowsPerPage}
              className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0"
            />
          </>
        )
      ) : (
        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          progressPending={loading}
          columns={columns}
          data={filteredPackages}
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
        />
      )}

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem} // Pass the selected item
      />
      <AddCustomer
        modal={addModal}
        toggleModal={() => {
          setAddModal(false);
          setEditingPackage(null); // Clear editing state when closing
        }}
        setDataList={setDataList}
        dataList={dataList}
        editingPackage={editingPackage}
        fetchCustomers={fetchCustomers}
        driverOptions={driverOptions}
      />
    </div>
  );
};

export default CustomerList;
