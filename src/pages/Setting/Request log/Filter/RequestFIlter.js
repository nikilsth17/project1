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
import RequestLogServices from "../../../../services/AustServices/RequestLogServices/RequestLogServices";
import toast from "react-hot-toast";

const RequestFIlter = ({
  requestlogdata,
  setFilters,
  loading,
  fetchrequestlogs,
  filters,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loadingClear, setLoadingClear] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const Options = [
    { value: 0, label: "Information" },
    { value: 1, label: "Error" },
    { value: 2, label: "Warning" },
  ];

  const clearLog = async () => {
    try {
      setLoadingClear(true);
      await RequestLogServices.deleteRequestLog();
      toast.success("Logs cleared successfully!");
      setLoadingClear(false);
      fetchrequestlogs();
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("🚀 ~ clearLog ~ error:", error);
      setLoadingClear(false);
    }
  };

  return (
    <div>
      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button
            className="me-2"
            size="sm"
            color="danger"
            onClick={clearLog}
            disabled={loadingClear}
          >
            <span className="d-flex align-items-center fs-13">
              {/* <i className={`bx bx-x fs-6 me-1 `}></i> */}
              {loadingClear && <Spinner className="me-2" size="sm" />}
              {loadingClear ? `Clearing Log...` : `Clear Log`}
            </span>
          </Button>
          <Button onClick={toggleFilter} size="sm">
            <span className="d-flex align-items-center fs-13">
              <i
                className={` ${
                  showFilter
                    ? "me-2 bx bx-chevron-up"
                    : "ms-auto me-1   bx bx-chevron-down"
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
                    value={filters.FromDate}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          FromDate: e.target.value,
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
                    value={filters.ToDate}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          ToDate: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup row>
              <Row className="pb-1">
                <Label sm={2}> Level:</Label>

                <Col sm={4}>
                  <Select
                    name="level"
                    id="level"
                    isClearable
                    value={filters.level}
                    onChange={(selectedOption) => {
                      setFilters((prev) => ({
                        ...prev,
                        level: selectedOption,
                      }));
                    }}
                    options={Options}
                  />
                </Col>

                <Label sm={2}>Filter Text:</Label>
                <Col sm={4}>
                  <Input
                    id="searchString"
                    value={filters.searchString}
                    placeholder="Filter Text"
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          searchString: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
            </FormGroup>
            <Row className="pb-1">
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
    </div>
  );
};

export default RequestFIlter;
