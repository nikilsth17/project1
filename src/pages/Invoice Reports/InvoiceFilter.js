import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Label,
  CardHeader,
  Card,
  CardBody,
  Container,
  Button,
  Spinner,
  FormGroup,
  ButtonGroup,
} from "reactstrap";
import DatePicker from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import InvoiceServices from "../../services/AustServices/InvoiceSev/InvoiceServices";
import Select from "react-select";
import CustomerAust from "../../services/AustServices/Customeraust/CustomerAust";
import { useParams } from "react-router-dom";
import RadioInputs from "./RadioInput/RadioInputs";
import AsyncSelect from "react-select/async";
import TablePagination from "../Pages/Starter/Pagination";
const InvoiceFilter = ({
  setinvoice,
  setFilters,
  fetchinvoiceDetails,
  filters,
  loading,
  gridView,
  setGridView,
}) => {
  const [showFilter, setShowFilter] = useState(false);

  const [isCustomerEmailID, setIsCustomerEmailID] = useState(null);

  const [searchResult, setSearchResult] = useState([]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await InvoiceServices.invoiceGetList({});
      console.log("Selected data:", response);
      setinvoice(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  const loadOptions = async (inputValue) => {
    try {
      const response = await CustomerAust.getCustomerNameList();
      const filteredCustomers = response.filter((customer) =>
        customer.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filteredCustomers.map((customer) => ({
        value: customer.id,
        label: customer.name,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCustomerChange = (selectedOption) => {
    setCustomerId(selectedOption?.value);
    setFilters((prev) => {
      return {
        ...prev,
        customerId: selectedOption?.value,
      };
    });

    setIsCustomerEmailID(selectedOption);
  };

  return (
    <Container>
      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <ButtonGroup className="me-2" size="sm">
            <Button
              outline
              // size="sm"
              title="Grid View"
              active={gridView}
              onClick={() => {
                fetchinvoiceDetails({
                  ...filters,
                  pageNumber: 1,
                  pageSize: 10,
                });
                setFilters((prev) => {
                  return {
                    ...prev,
                    pageNumber: 1,
                    pageSize: 12,
                  };
                });
                setGridView(true);
              }}
            >
              <i class="bx bx-grid-alt"></i>
            </Button>
            <Button
              outline
              active={!gridView}
              // size="sm"
              title="Table View"
              onClick={() => {
                fetchinvoiceDetails({
                  ...filters,
                  pageNumber: 1,
                  pageSize: 10,
                });
                setFilters((prev) => {
                  return {
                    ...prev,
                    pageNumber: 1,
                    pageSize: 10,
                  };
                });
                setGridView(false);
              }}
            >
              <i class="bx bx-list-ul"></i>
            </Button>
          </ButtonGroup>
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

      {showFilter && (
        <Card>
          <CardHeader style={{ height: "3rem", backgroundColor: "#5A72B8" }}>
            <h5 className="text-white ">Search by Filter Panel</h5>
          </CardHeader>

          <CardBody>
            <FormGroup row>
              <Row className="pb-1">
                <Label sm={2}>Created From Date:</Label>
                <Col sm={4}>
                  <Input
                    type="date"
                    className="form-control"
                    value={filters.createdDateFrom}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          createdDateFrom: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>

                <Label sm={2}>Created To Date:</Label>
                <Col sm={4}>
                  <Input
                    type="date"
                    className="form-control"
                    value={filters.createdDateTo}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          createdDateTo: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup row>
              <Row className="pb-1">
                <Label sm={2}>Customer:</Label>
                <Col sm={4}>
                  <AsyncSelect
                    name="customerId"
                    id="customerId"
                    isClearable
                    loadOptions={loadOptions}
                    value={filters.customerId}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          customerId: e,
                        };
                      });
                    }}
                  />
                </Col>
                <Label sm={2}>Minimum Amount:</Label>
                <Col sm={4}>
                  <Input
                    name="totalAmountMin"
                    id="totalAmountMin"
                    value={filters.totalAmountMin}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          totalAmountMin: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup row>
              <Row className="pb-1">
                <Label sm={2}> Maximum Amount:</Label>

                <Col sm={4}>
                  <Input
                    name="totalAmountMax"
                    id="totalAmountMax"
                    value={filters.totalAmountMax}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          totalAmountMax: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
                <Label sm={2}>Reference No.:</Label>
                <Col sm={4}>
                  <Input
                    type="text"
                    className="form-control"
                    value={filters.refNumber}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          refNumber: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup row>
              <Row className="pb-1">
                <Label sm={2}>Status:</Label>
                <Col sm={4} className="mt-2">
                  <span>
                    <Label check>
                      <RadioInputs
                        name="isPaid"
                        options={[
                          { value: "true", label: "Paid" },
                          { value: "false", label: "UnPaid" },
                        ]}
                        selectedOption={filters.isPaid}
                        onChange={(e) => {
                          setFilters((prev) => {
                            return {
                              ...prev,
                              isPaid: e,
                            };
                          });
                        }}
                      />
                    </Label>
                  </span>
                </Col>
                <Label sm={2}>Overdue Payment:</Label>
                <Col sm={4} className="mt-2">
                  <span>
                    <Label check>
                      <RadioInputs
                        name="duePayment"
                        options={[
                          { value: "true", label: "Yes" },
                          { value: "false", label: "No" },
                        ]}
                        selectedOption={filters.duePayment}
                        onChange={(e) => {
                          setFilters((prev) => {
                            return {
                              ...prev,
                              duePayment: e,
                            };
                          });
                        }}
                      />
                    </Label>
                  </span>
                </Col>
              </Row>
            </FormGroup>
            <Row className="pb-1">
              <Col>
                <Col className="d-flex justify-content-end">
                  <Button
                    onClick={() => {
                      setFilters((...prev) => {
                        return {
                          ...filters,
                          pageNumber: 1,
                        };
                      });
                      fetchinvoiceDetails({ ...filters, pageNumber: 1 });
                    }}
                    disabled={loading}
                    style={{ minWidth: "120px" }}
                  >
                    {loading && (
                      <Spinner color="white" size="sm" className="mr-2" />
                    )}
                    <span style={{ marginLeft: "10px" }}>Search</span>
                  </Button>
                </Col>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* Display search results or handle data as needed */}
      {searchResult.length > 0 && (
        <div>
          <h3>Search Results:</h3>
        </div>
      )}
    </Container>
  );
};

export default InvoiceFilter;
