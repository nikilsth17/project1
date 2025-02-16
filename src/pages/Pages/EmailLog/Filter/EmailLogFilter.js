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
import AsyncSelect from "react-select/async";
import ApiLogServices from "../../../../services/AustServices/ApiLogServices/ApiLogServices";
import toast from "react-hot-toast";
import Select from "react-select";
import EmailLogServices from "../../../../services/AustServices/EmailLogServices/EmailLogServices";

const EmailLogFilter = ({
  apilogData,
  setFilters,
  fetchEmailLogs,
  filters,
  loading,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loadingClear, setLoadingClear] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const clearLog = async () => {
    try {
      setLoadingClear(true);
      await EmailLogServices.deleteEmailLogs();
      toast.success("Logs cleared successfully!");
      setLoadingClear(false);
      fetchEmailLogs();
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
          <Button className="me-2" size="sm" color="danger" onClick={clearLog}>
            <span className="d-flex align-items-center fs-13">
              {loadingClear && <Spinner size={"sm"} className="me-2" />}
              {/* <i className={`bx bx-x fs-6 me-1 `}></i> */}
              {loadingClear ? "Clearing Log..." : "Clear Log"}
            </span>
          </Button>
          <i class=""></i>
          <Button onClick={toggleFilter} size="sm">
            <span className="d-flex align-items-center fs-13">
              <i
                className={` ${
                  showFilter
                    ? "me-2 bx bx-chevron-up"
                    : "ms-auto me-1   bx bx-chevron-down"
                } fs-13`}
              ></i>
              {showFilter ? "Hide Filter" : "Filter"}
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
                <Label sm={2}>From Date:</Label>
                <Col sm={4}>
                  <Input
                    type="date"
                    className="form-control"
                    value={filters.fromDate}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          fromDate: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>

                <Label sm={2}>To Date:</Label>
                <Col sm={4}>
                  <Input
                    type="date"
                    className="form-control"
                    value={filters.toDate}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          toDate: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup row>
              <Row className="pb-1">
                <Label sm={2}> Status:</Label>

                <Col sm={4}>
                  <Select
                    name="status"
                    options={[
                      { label: "Success", value: "true" },
                      { label: "Failed", value: "false" },
                    ]}
                    isClearable
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          status: e?.value || "",
                        };
                      });
                    }}
                  />
                </Col>

                <Label sm={2}>Filter Text:</Label>
                <Col sm={4}>
                  <Input
                    name="fitlerText"
                    id="filterText"
                    // value={filters.statusCode}
                    onChange={(e) => {
                      setFilters((prev) => {
                        return {
                          ...prev,
                          filterString: e.target.value,
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
                  <Row className="pb-1">
                    <div className="d-flex justify-content-end">
                      <Button
                        onClick={() => {
                          fetchEmailLogs(filters);
                        }}
                        disabled={loading}
                        style={{ minWidth: "120px" }}
                      >
                        {loading && (
                          <Spinner color="white" size="sm" className="mr-2" />
                        )}
                        <span style={{ marginLeft: "10px" }}>Search</span>
                      </Button>
                    </div>
                  </Row>
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

export default EmailLogFilter;
