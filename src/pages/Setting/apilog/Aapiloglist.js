import React, { useState, useEffect } from "react";
import { apilogdatalist } from "./column/Columnlog";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ButtonGroup,
  Input,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import AapilogFIlter from "./Filter/AapilogFIlter";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Aapiloglist = () => {
  const [apilogData, setApilogData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    ApplicationName: "",
    FromDate: "",
    ToDate: "",
    Path: "",
    statusCode: "",
  });
  const navigate = useNavigate();

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

  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  async function fetchapilogs() {
    try {
      setLoading(true);
      const fetchedapiloglist = await ConfigureSetingServices.apiloglist(
        filters
      );
      setApilogData(fetchedapiloglist);
      setLoading(false);
    } catch (err) {
      console.log("🚀 ~ fetchapilogs ~ err:", err);
      setError(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchapilogs();
  }, []);

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const handleClearFilter = () => {
    setFilterText("");
  };
  const data = apilogData
    .filter(
      (item) =>
        JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
        -1
    )
    .map((filteredItem, index) => {
      const utcDate = filteredItem.timestamp; // ISO-8601 formatted date returned from server
      const localDate = new Date(utcDate);

      // Split the date by '/'
      const dateParts = localDate.toLocaleDateString().split("/");

      // Join the date parts with hyphens
      const formattedDate = `${dateParts[2]}-${dateParts[0]}-${
        dateParts[1]
      }, ${localDate.toLocaleTimeString()}`;

      return {
        id: index + 1,
        rowId: filteredItem.id,
        applicationName: (
          <Link to={`/api-log/${filteredItem.id}`} target="_blank">
            {filteredItem.applicationName}
          </Link>
        ),
        timestamp: formattedDate,
        httpMethod: filteredItem.httpMethod,
        path: filteredItem.path,
        responseStatusCode: filteredItem.responseStatusCode,
      };
    });

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Api log list"
            pageTitle="Api log "
            // breadcrumbItems={breadcrumbItems}
          />
          <AapilogFIlter
            apilogData={setApilogData}
            setFilters={setFilters}
            fetchapilogs={fetchapilogs}
            filters={filters}
            loading={loading}
          />
          <Row>
            <div className="d-flex pb-2 gap-1">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Name, Time, Http, Path"
                />
              </Col>
              {/* <Col lg={2}>
                                <Button
                                    color="btn btn-soft-primary"
                                    className="btn-md gap-1"
                                    size="md"
                                    onClick={handleClearFilter}
                                >
                                    Search
                                </Button>
                            </Col> */}
            </div>
          </Row>
          <DataTable
            responsive
            striped
            pagination
            fixedHeader
            persistTableHead
            paginationPerPage={50}
            paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => {
              window.open(`/api-log/${row.rowId}`, "_blank");
            }}
            progressPending={loading}
            customStyles={customStyles}
            paginationResetDefaultPage={resetPaginationToggle}
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
            columns={apilogdatalist}
            data={data}
          />
        </div>
      </React.Fragment>
    </Container>
  );
};

export default Aapiloglist;
