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
} from "reactstrap";

import Select from "react-select";

const Filter = ({
  requestlogdata,
  setFilters,
  loading,
  fetchrequestlogs,
  filters,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const Options = [
    { value: 0, label: "Information" },
    { value: 1, label: "Error" },
    { value: 2, label: "Warning" },
  ];
  return (
    <div>
      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button onClick={toggleFilter} size="lg" style={{ width: '150px' }}>
            <span className="d-flex align-items-center fs-15">
              <i
                className={`ri ri-filter-3-line ${
                  showFilter ? "me-2" : "ms-auto me-1"
                } fs-17`}
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
                <Label sm={1}>From Date:</Label>
                <Col sm={4}>
                  <Input
                    type="date"
                    className="form-control"
                    value={filters.DeliveryDateFrom}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          DeliveryDateFrom: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>

                <Label sm={1}>To Date:</Label>
                <Col sm={4}>
                  <Input
                    type="date"
                    className="form-control"
                    value={filters.DeliveryDateTo}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          DeliveryDateTo: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>

                <Col className="d-flex justify-content-end mx-auto" sm={2}>
                  <Button
                    onClick={() => {
                      fetchrequestlogs({ filters: { ...filters } });
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
            </FormGroup>

            {/* <Row className="pb-1">
              <Col>
                <Col className="d-flex justify-content-end mx-auto">
                  <Button
                    onClick={() => {
                      fetchrequestlogs({ filters: { ...filters } });
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
            </Row> */}
          </CardBody>
        </Card>
      )}

      {/* Display search results or handle data as needed */}
      {searchResult.length > 0 && (
        <div>
          <h3>Search Results:</h3>
        </div>
      )}
    </div>
  );
};

export default Filter;
