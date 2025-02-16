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
  ButtonGroup,
} from "reactstrap";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import CustomerAust from "../../../services/AustServices/Customeraust/CustomerAust";
import OneWorldServices from "../../../services/Inventory Services/OneWorldServices";
import GeneralServices from "../../../services/GeneralServices/GeneralServices";
const FilterComponent = ({
  setShipment,
  filters,
  setFilters,
  fetchShipmentDetails,
  loading,
  setGridView,
  gridView,
}) => {
  const [showFilter, setShowFilter] = useState(false);

  const [shipmentStatusOption, setShipmentStatusOption] = useState();
  const [serviceProviderOption, setServiceProviderOption] = useState();

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const loadCustomerOptions = async (inputValue, callback) => {
    try {
      if (inputValue.length < 3) {
        callback([]);
        return;
      }
      const fetchedCustomers = await CustomerAust.getList();
      const filteredCustomers = fetchedCustomers.data.filter((customer) =>
        customer.emailAddress.toLowerCase().includes(inputValue.toLowerCase())
      );
      const customerOptions = filteredCustomers.map((customer) => ({
        value: customer.id,
        label: customer.emailAddress,
      }));
      callback(customerOptions);
    } catch (error) {
      console.error("Error fetching customer options:", error);
      callback([]);
    }
  };

  const fetchServiceProvider = async () => {
    try {
      const response = await OneWorldServices.generalService();
      const temp = response.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setServiceProviderOption(temp);
    } catch (error) {
      console.error("Error fetching service provider options:", error);
    }
  };

  const fetchShipmentStatus = async () => {
    try {
      const response = await GeneralServices.getShipmentStatus();
      const temp = response.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setShipmentStatusOption(temp);
    } catch (error) {
      console.log("🚀 ~ fetchShipmentStatus ~ error:", error);
    }
  };

  useEffect(() => {
    fetchServiceProvider();
    fetchShipmentStatus();
  }, []);

  return (
    <Container>
      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
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
            <h5 className="text-white">Search by Filter Panel</h5>
          </CardHeader>

          <CardBody>
            {/* <Row className="pb-1">
              <Label sm={2}>From Date:</Label>
              <Col sm={4}>
                <Input
                  type="date"
                  // value={filters.createdDateFrom}
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
              <Col sm={4}>
                <Input
                  type="date"
                  // value={filters.createdDateTo}
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
            </Row> */}

            {/* <Row className="pb-1">
              <Label sm={2}>Collection Date:</Label>
              <Col sm={4}>
                <Input
                  type="date"
                  // value={filters.collectionDateFrom}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        collectionDateFrom: e.target.value,
                      };
                    });
                  }}
                />
              </Col>
              <Col sm={4}>
                <Input
                  type="date"
                  // value={filters.collectionDateTo}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        collectionDateTo: e.target.value,
                      };
                    });
                  }}
                />
              </Col>
            </Row> */}

            <Row className="pb-1">
              <Label sm={2}>Email:</Label>
              <Col sm={4}>
                <AsyncSelect
                  name="userEmail"
                  id="userEmail"
                  isClearable
                  placeholder="Search..."
                  loadOptions={loadCustomerOptions}
                  // value={filters.userEmail}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        userEmail: e,
                      };
                    });
                  }}
                />
              </Col>
              <Label sm={2}>Shipment Status:</Label>
              <Col sm={4}>
                <Select
                  options={shipmentStatusOption}
                  name="shipmentStatus"
                  // value={filters.statusId}
                  isClearable
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        statusId: e,
                      };
                    });
                  }}
                />
              </Col>
            </Row>

            {/* <Row className="pb-1">
              <Label sm={2}>PickUp Address:</Label>
              <Col sm={4}>
                <AsyncSelect
                  name="pickUpAddress"
                  id="pickUpAddress"
                  isClearable
                  loadOptions={loadPickupOptions}
                  value={filters.pickUpAddress}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        pickUpAddress: e,
                      };
                    });
                  }}
                />
              </Col>
              <Label sm={2}>Destination Address:</Label>
              <Col sm={4}>
                <AsyncSelect
                  name="destinationAddress"
                  id="destinationAddress"
                  isClearable
                  loadOptions={loadDropupOptions}
                  value={filters.destinationAddress}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        destinationAddress: e,
                      };
                    });
                  }}
                />
              </Col>
            </Row> */}

            <Row className="pb-1">
              <Label sm={2}>ETA(days):</Label>
              <Col sm={4}>
                <Input
                  // value={filters.estimatedRate}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        estimatedDays: e.target.value,
                      };
                    });
                  }}
                />
              </Col>
            </Row>

            <Row className="pb-1">
              <Label sm={2}>Total Cost Min:</Label>
              <Col sm={4}>
                <Input
                  // value={filters.totalCostMin}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        totalCostMin: e.target.value,
                      };
                    });
                  }}
                />
              </Col>
              <Label sm={2}>Total Cost Max:</Label>
              <Col sm={4}>
                <Input
                  // value={filters.totalCostMax}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        totalCostMax: e.target.value,
                      };
                    });
                  }}
                />
              </Col>
            </Row>

            <Row className="pb-1">
              <Label sm={2}>Service Provider:</Label>
              <Col sm={4}>
                <Select
                  name="serviceProvider"
                  id="serviceProvider"
                  isClearable
                  options={serviceProviderOption}
                  // value={filters.serviceProvider}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        serviceProvider: e,
                      };
                    });
                  }}
                />
              </Col>
              <Label sm={2}>Query:</Label>
              <Col sm={4}>
                <Input
                  type="text"
                  // value={filters.query}
                  onChange={(e) => {
                    setFilters((prev) => {
                      return {
                        ...prev,
                        query: e.target.value,
                      };
                    });
                  }}
                />
              </Col>
            </Row>

            <Row className="pb-1">
              <Col lg={10}></Col>
              <Col lg={2} className="text-end">
                <Button
                  onClick={() => {
                    fetchShipmentDetails({ filters: { ...filters } });
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
            </Row>
          </CardBody>
        </Card>
      )}
    </Container>
  );
};

export default FilterComponent;
