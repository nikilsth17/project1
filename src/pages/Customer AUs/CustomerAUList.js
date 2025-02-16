import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Spinner,
  CardHeader,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CustomerAust from "../../services/AustServices/Customeraust/CustomerAust";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { useFormik } from "formik";
import TablePagination from "../Pages/Starter/Pagination";
import InvoiceServices from "../../services/AustServices/InvoiceSev/InvoiceServices";
import CustomerTypeServices from "../../services/Inventory Services/CustomerTypeServices";
import { NameInitialsAvatar } from "react-name-initials-avatar";

function groupByNameAndLastname(data) {
  let groupedData = {};
  data.forEach((item) => {
    const key = item.name + item.lastname;
    if (!groupedData[key]) {
      groupedData[key] = item;
    }
  });
  return Object.values(groupedData);
}

const CandidateGrid = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saleCustomers, setSaleCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [createdDateFrom, setCreatedDateFrom] = useState("");
  const [createdDateTo, setCreatedDateTo] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isUserEmail, setIsUserEmail] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSystemVerified, setIsSystemVerified] = useState("");
  const [firstName, setFirstName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Adjust as needed
  const [totalData, setTotalData] = useState(0);
  const [customerTypeloading, setCustomerTypeLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const indexRef = useRef(0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const customers = saleCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const fetchCustomersPage = async ({
    pageNumber: pageNumber,
    pageSize: pageSize,
  }) => {
    try {
      setLoading(true);
      const response = await CustomerAust.getListpage(pageNumber, pageSize);
      setSaleCustomers(response.data); // Assuming your API returns data in a certain format
      setTotalCustomer(response.totalData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCustomer = async () => {
    try {
      const response = await CustomerAust.getList();
      setTotalCustomer(response.length);
    } catch (error) {
      console.log("🚀 ~ calculateTotalCustomer ~ error:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    fetchCustomersPage({ pageNumber: pageNumber, pageSize: pageSize });
    setCurrentPage(pageNumber);
  };

  // Number of documents to display per page

  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const [showModal, setShowModal] = useState(false);
  const [newCustomerType, setNewCustomerType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const customerData = await CustomerAust.view(id);
          setNewCustomerType(customerData);
          console.log(customerData);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, [id]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSave = async ({ id, customerType }) => {
    try {
      setCustomerTypeLoading(true);
      console.log("id", id);

      // Make API call to update customer type with newCustomerType
      await CustomerAust.updatecustomerType(id, customerType.value);

      // Update customerType state with new value
      toast.success("Customer type changed successfully!", {
        autoClose: 3000,
      });
      setCustomerTypeLoading(false);
      // setNewCustomerType(newCustomerType);
      toggleModal(); // Close modal after saving
      fetchCustomersPage({ pageNumber: pageNumber, pageSize: pageSize });
    } catch (error) {
      console.error("Error updating customer type:", error);
      setCustomerTypeLoading(false);
    }
  };

  const [customerTypes, setCustomerTypes] = useState([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomerTypes = async () => {
      try {
        const types = await CustomerTypeServices.getList();
        // Assuming the types are in the format { id: "1", name: "Type 1" }
        const options = types.map((type) => ({
          value: type.id,
          label: type.title,
        }));
        setCustomerTypes(options);
      } catch (error) {
        console.error("Error fetching customer types:", error);
      }
    };

    fetchCustomerTypes();
  }, []);

  const handleCustomerTypeChange = (selectedOption) => {
    setSelectedCustomerType(selectedOption);
    // You can perform further actions with the selected customer type
  };

  const options = [
    { value: true, label: "Verified" },
    { value: false, label: "Not Verified" },
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await CustomerAust.getCustomerList(
        userEmail,
        createdDateFrom,
        createdDateTo,
        address,
        phoneNumber,
        isSystemVerified,
        firstName?.value
      );
      setSaleCustomers(response.data);
      setTotalCustomer(response.length);
      setTotalCustomer(response.totalData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      if (window.confirm("Do you really want to delete Customer?")) {
        const deletedCustomer = await CustomerAust.delete(customerId);
        console.log(
          `Customer deleted successfully: ${JSON.stringify(deletedCustomer)}`
        );
        setSaleCustomers((prevCustomerList) =>
          prevCustomerList.filter((customer) => customer.id !== customerId)
        );
        toast.success("Customer Deleted Successfully", { autoClose: 3000 });
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting Customer:", error);
    }
  };

  const verifyCustomer = async (customerId) => {
    try {
      setLoadingVerify(true);
      const response = await CustomerAust.customerVerify(customerId);
      toast.success("Customer is verified", {
        autoClose: 3000,
      });
      setLoadingVerify(false);
      fetchCustomersPage({ pageNumber: currentPage, pageSize: pageSize });
    } catch (error) {
      toast.error(
        error.response.data ? error.response.data : "Error verifying customer!",
        {
          autoClose: 3000,
        }
      );
      console.error("Error verifying customer:", error);
      setLoadingVerify(false);
    }
  };

  useEffect(() => {
    // calculateTotalCustomer();
    fetchCustomersPage({ pageNumber: pageNumber, pageSize: pageSize });
  }, []); // Fetch data whenever the page number changes

  const loadEmailOptions = async (inputValue, callback) => {
    try {
      if (inputValue?.length < 3) {
        callback([]);
        return;
      }
      const fetchedCustomers = await CustomerAust.getCustomerNameList({
        nameFilter: inputValue,
      });

      const emailOptions = fetchedCustomers.map((customer) => ({
        value: customer.email,
        label: customer.email,
      }));

      callback(emailOptions);
    } catch (error) {
      console.error("Error fetching customer options:", error);
    }
  };

  const loadCustomerOptions = async (inputValue, callback) => {
    try {
      if (inputValue?.length < 3) {
        callback([]);
        return;
      }
      const fetchedCustomers = await CustomerAust.getCustomerNameList({
        nameFilter: inputValue,
      });

      const filteredCustomers = groupByNameAndLastname(fetchedCustomers);

      const customerOptions = filteredCustomers.map((customer) => {
        return {
          label: customer.name + " " + customer.lastname,
          // " - " +
          // customer.email,
          // " - " +
          // customer.phoneNumber,
          value: customer.name,
        };
      });
      // console.log("🚀 ~ emailOptions ~ emailOptions:", emailOptions);
      callback(customerOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCustomerChange = (selectedOption) => {
    setUserEmail(selectedOption?.value);
    setIsUserEmail(selectedOption);
    console.log("Selected customer email ID:", selectedOption?.value);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Customer List" pageTitle="Customer " />

          <Row className="search-bar justify-content-start">
            <Col className="text-end mb-2">
              <Button onClick={toggleFilter} size="sm">
                <span className="d-flex align-items-center fs-13">
                  <i
                    className={`ri ri-filter-3-line ${
                      showFilter ? "me-2" : "ms-auto me-1"
                    } fs-13`}
                  ></i>
                  {showFilter ? "Hide Search" : "Search By"}
                </span>
              </Button>
            </Col>
          </Row>

          <Row className="pb-5">
            <Col lg={12}>
              {showFilter && (
                <Card>
                  <CardHeader
                    style={{ height: "3rem", backgroundColor: "#5A72B8" }}
                  >
                    <h5 className="text-white ">Search by Filter Panel</h5>
                  </CardHeader>

                  <CardBody>
                    <Row className="pb-1">
                      <Label sm={2}>Created From Date:</Label>
                      <Col sm={4}>
                        <Input
                          type="date"
                          className="form-control"
                          value={createdDateFrom}
                          onChange={(e) => setCreatedDateFrom(e.target.value)}
                        />
                      </Col>

                      <Label sm={2}>Created To Date:</Label>
                      <Col sm={4}>
                        <Input
                          type="date"
                          className="form-control"
                          value={createdDateTo}
                          onChange={(e) => setCreatedDateTo(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row className="pb-1">
                      <Label sm={2}>Name:</Label>
                      <Col sm={4}>
                        {/* <Input
                          name="firstName"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        /> */}
                        <AsyncSelect
                          name="firstName"
                          id="firstName"
                          placeholder="Search..."
                          isClearable
                          loadOptions={loadCustomerOptions}
                          value={firstName}
                          onChange={setFirstName}
                        />
                      </Col>
                      <Label sm={2}>Email:</Label>
                      <Col sm={4}>
                        <AsyncSelect
                          name="userEmail"
                          id="userEmail"
                          isClearable
                          loadOptions={loadEmailOptions}
                          value={isUserEmail}
                          onChange={handleCustomerChange}
                        />
                      </Col>
                    </Row>

                    <Row className="pb-1">
                      <Label sm={2}>Address:</Label>
                      <Col sm={4}>
                        <Input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Col>
                      <Label sm={2}>Phone number:</Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          className="form-control"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Label sm={2}>System Verified:</Label>
                      <Col sm={4}>
                        <Select
                          id="isSystemVerified"
                          options={options}
                          value={options.find(
                            (option) => option.value === isSystemVerified
                          )}
                          onChange={(selectedOption) => {
                            setIsSystemVerified(
                              selectedOption.value ? "true" : "false"
                            );
                          }}
                        />
                      </Col>
                    </Row>

                    <Row className="pb-1">
                      <Col className="d-flex justify-content-end">
                        <Button
                          onClick={handleSearch}
                          type="submit"
                          disabled={loading}
                          style={{ minWidth: "120px" }}
                        >
                          {loading && (
                            <Spinner color="white" size="sm" className="mr-2" />
                          )}
                          <span style={{ marginLeft: "10px" }}>Search</span>
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              )}
              {loading ? (
                <Row className="justify-content-center align-items-center">
                  <Col xs={2}>
                    <Triangle
                      visible={true}
                      height="80"
                      width="80"
                      color="#5B71B9"
                      ariaLabel="triangle-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                    <h6 className="mt-2">Loading...</h6>
                  </Col>
                </Row>
              ) : saleCustomers?.length === 0 ? (
                <Row className="justify-content-center align-items-center">
                  <p className="p-2 pt-5 justify-content-center align-item-center">
                    <Col xs={12} className="text-center">
                      <img
                        src="blankdata.png"
                        alt="No data available"
                        style={{ width: "400", height: "300px" }}
                      />
                    </Col>
                  </p>
                </Row>
              ) : (
                <Row>
                  {saleCustomers.map((customerItem, index) => {
                    return (
                      <Col md={6} lg="4" key={index}>
                        <Card
                          className="rounded-4 py-3"
                          style={{ maxHeight: "200px" }}
                        >
                          <div className="d-flex rounded-4 gap-3 justify-content-end  px-3">
                            {!customerItem.isSystemVerified ? (
                              <Link
                                onClick={() => {
                                  verifyCustomer(customerItem.id);
                                  indexRef.current = index;
                                }}
                                // style={{ cursor: "pointer" }}
                                title={`Customer Verification`}
                              >
                                {loadingVerify && indexRef.current === index ? (
                                  <Spinner size={"sm"} />
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1.65em"
                                    height="1.65em"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fill="currentColor"
                                      fill-rule="evenodd"
                                      d="M15.418 5.643a1.25 1.25 0 0 0-1.34-.555l-1.798.413a1.25 1.25 0 0 1-.56 0l-1.798-.413a1.25 1.25 0 0 0-1.34.555l-.98 1.564c-.1.16-.235.295-.395.396l-1.564.98a1.25 1.25 0 0 0-.555 1.338l.413 1.8a1.25 1.25 0 0 1 0 .559l-.413 1.799a1.25 1.25 0 0 0 .555 1.339l1.564.98c.16.1.295.235.396.395l.98 1.564c.282.451.82.674 1.339.555l1.798-.413a1.25 1.25 0 0 1 .56 0l1.799.413a1.25 1.25 0 0 0 1.339-.555l.98-1.564c.1-.16.235-.295.395-.395l1.565-.98a1.25 1.25 0 0 0 .554-1.34L18.5 12.28a1.25 1.25 0 0 1 0-.56l.413-1.799a1.25 1.25 0 0 0-.554-1.339l-1.565-.98a1.25 1.25 0 0 1-.395-.395zm-.503 4.127a.5.5 0 0 0-.86-.509l-2.615 4.426l-1.579-1.512a.5.5 0 1 0-.691.722l2.034 1.949a.5.5 0 0 0 .776-.107z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                )}

                                {/* <i class="ri-verified-badge-fill fs-4"></i> */}
                              </Link>
                            ) : (
                              <h6>
                                <Badge color="success">Verified</Badge>
                              </h6>
                            )}
                            <Link
                              onClick={() => {
                                setSelectedCustomerType({
                                  label: customerItem?.customerType?.title,
                                  value: customerItem?.customerType?.id,
                                });
                                setSelectedCustomerId(customerItem?.id);

                                toggleModal();
                              }}
                              // style={{ cursor: "pointer" }}
                              title={`Customer Type: ${customerItem?.customerType?.title}`}
                            >
                              <i class="ri-user-2-fill fs-5 "></i>
                            </Link>

                            <Link
                              className="text-warning"
                              to={`/CustomerAUS/edit/${customerItem.id}`}
                              title={`Edit Customer: ${customerItem.id}`}
                            >
                              <i className="ri-edit-line fs-5"></i>
                            </Link>

                            <Link
                              className="text-danger"
                              onClick={() => handleDelete(customerItem.id)}
                              title={`Delete Customer: ${customerItem.id}`}
                            >
                              <i className="ri-delete-bin-2-line fs-5"></i>
                            </Link>
                          </div>
                          <CardBody>
                            <Link
                              style={{ color: "black", textDecoration: "none" }}
                              to={`/CustomerAUS/details/${customerItem.id}`}
                            >
                              <Row>
                                <Col xs={4}>
                                  {" "}
                                  <NameInitialsAvatar
                                    bgColor={"#E0E0E0"}
                                    borderColor={"white"}
                                    textSize="25px"
                                    textColor={"#5B71B9"}
                                    size="60px"
                                    name={`${customerItem.firstName} ${customerItem.lastName}`}
                                  />
                                </Col>
                                <Col xs={8}>
                                  <Row className="fw-bold">
                                    <span
                                      className="text-nowrap overflow-hidden textOverFlow-ellipsis  px-0"
                                      style={{
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {customerItem.firstName}{" "}
                                      {customerItem.lastName}
                                    </span>
                                  </Row>
                                  <Row>
                                    <span
                                      className="text-nowrap overflow-hidden textOverFlow-ellipsis  px-0"
                                      style={{
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {customerItem.addressLine1}
                                    </span>
                                  </Row>
                                  <Row className="single-line-row">
                                    <span
                                      className="text-nowrap overflow-hidden textOverFlow-ellipsis  px-0"
                                      style={{
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {customerItem.city}, {customerItem.state},{" "}
                                      {customerItem.postCode}
                                    </span>
                                  </Row>
                                  <Row>
                                    <span
                                      className="text-nowrap overflow-hidden textOverFlow-ellipsis  px-0"
                                      style={{
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {customerItem.phoneNumber}
                                    </span>
                                  </Row>
                                  <Row>
                                    <span
                                      className="text-nowrap overflow-hidden textOverFlow-ellipsis  px-0"
                                      style={{
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {customerItem.emailAddress}
                                    </span>
                                  </Row>
                                  <Row>
                                    <span
                                      className="text-nowrap overflow-hidden textOverFlow-ellipsis  px-0"
                                      style={{
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {customerItem.company}
                                    </span>
                                  </Row>
                                </Col>
                              </Row>
                              {/* <Row
                                style={{ borderBottom: "1px solid #ddd" }}
                                className="pt-2"
                              >
                                <Col lg={6} className="col-6 pb-2 pb-2">
                                  <p className="mb-1 fs-14 text-muted">Name:</p>

                                  <h6 className="fs-13 te mb-0  fw-bold">
                                    {customerItem.firstName}{" "}
                                    {customerItem.lastName}
                                  </h6>
                                </Col>
                                <Col lg={6} className="col-6 pb-2 pb-2">
                                  <p className="mb-1 fs-14 text-muted">
                                    Address Line 1:
                                  </p>

                                  <h6 className="fs-13 te mb-0  fw-bold">
                                    {customerItem.addressLine1}
                                  </h6>
                                </Col>
                              </Row>
                              <Row style={{ borderBottom: "1px solid #ddd" }}>
                                <Col lg={6} className="col-6 pb-2 pb-2">
                                  <p className="mb-1 fs-14 text-muted">
                                    Phone number:
                                  </p>

                                  <h6 className="fs-13 te mb-0  fw-bold">
                                    {customerItem.phoneNumber}
                                  </h6>
                                </Col>

                                <Col lg={6} className="col-6 pb-2 pb-2">
                                  <p className="mb-1 fs-14 text-muted">
                                    Email address:
                                  </p>

                                  <h6 className="fs-13 te mb-0  fw-bold">
                                    {customerItem.emailAddress}
                                  </h6>
                                </Col>
                              </Row>

                              <Row
                                style={{ borderBottom: "1px solid #ddd" }}
                                className="pt-2"
                              >
                                {customerItem.company && (
                                  <Col lg={6} className="col-6 pb-2 pb-2">
                                    <p className="mb-1 fs-14 text-muted">
                                      Company:
                                    </p>
                                    <h6 className="fs-13 te mb-0  fw-bold">
                                      {customerItem.company}
                                    </h6>
                                  </Col>
                                )}

                                <Col lg={6} className="col-6 pb-2 pb-2">
                                  <p className="mb-1 fs-14 text-muted">
                                    Address:
                                  </p>
                                  <h6 className="fs-13 te mb-0  fw-bold">
                                    {customerItem.city}, {customerItem.state},{" "}
                                    {customerItem.postCode}
                                  </h6>
                                </Col>
                              </Row> */}
                            </Link>
                          </CardBody>
                          {/* {!customerItem.isSystemVerified && (
                            <Row>
                              <Col lg={12}>
                                <Button
                                  className="btn-sm "
                                  style={{ width: "100%" }}
                                  onClick={(event) => {
                                    verifyCustomer(customerItem.id);
                                    indexRef.current = index;
                                  }}
                                  disabled={loadingVerify}
                                >
                                  {loadingVerify &&
                                    indexRef.current === index && (
                                      <Spinner size="sm" className="me-2" />
                                    )}
                                  {loadingVerify && indexRef.current === index
                                    ? "Verifying Customer ..."
                                    : " Verify Customer"}
                                </Button>
                              </Col>
                            </Row>
                          )} */}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Col>
          </Row>

          {/* Pagination */}

          <Row className="g-0 justify-content-end mb-4" id="pagination-element">
            <Col sm={6}>
              <div className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                <div className="page-item">
                  {/* <TablePagination
                    pagesCount={Math.ceil(saleCustomers.length / itemsPerPage)}
                    currentPage={currentPage}
                    handlePreviousClick={() =>
                      handlePageChange(currentPage - 1)
                    }
                    handleNextClick={() => handlePageChange(currentPage + 1)}
                    handlePageClick={handlePageChange}
                  /> */}
                  {/* <Row className="justify-content-center mt-3">
                    <Col xs="auto">
                      <Button onClick={handlePreviousPage} disabled={pageNumber === 1}>
                        Previous
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button onClick={handleNextPage} disabled={pageNumber === totalPages}>
                        Next
                      </Button>
                    </Col>
                  </Row> */}

                  <Row
                    className="g-0 justify-content-end mb-4"
                    id="pagination-element"
                  >
                    <Col sm={6}>
                      <div className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                        <div className="page-item">
                          <TablePagination
                            pagesCount={Math.ceil(totalCustomer / pageSize)}
                            currentPage={currentPage}
                            handlePreviousClick={() =>
                              handlePageChange(currentPage - 1)
                            }
                            handleNextClick={() =>
                              handlePageChange(currentPage + 1)
                            }
                            handlePageClick={handlePageChange}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Modal for editing customer type */}
      <Modal isOpen={showModal} toggle={toggleModal}>
        <ModalHeader onClick={toggleModal}>Edit Customer Type</ModalHeader>
        <ModalBody>
          <Label> Customer Type:</Label>
          <Select
            options={customerTypes}
            value={selectedCustomerType}
            onChange={(e) => {
              handleCustomerTypeChange(e);
            }}
            placeholder="Select customer type..."
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              handleSave({
                id: selectedCustomerId,
                customerType: selectedCustomerType,
              });
            }}
          >
            {customerTypeloading && <Spinner size="sm" className="me-2" />}
            {customerTypeloading ? "Saving..." : "Save"}
          </Button>
          <Button color="danger" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default CandidateGrid;
