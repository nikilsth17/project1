import React, { useState, useEffect } from "react";
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
import { requestloglist } from "./Columns/requestloglist";
import { Link } from "react-router-dom";
import RequestFIlter from "./Filter/RequestFIlter";
import { useNavigate } from "react-router-dom";
const Requestloglist = () => {
  const [requestlogdata, setrequestlogdata] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: "",
    FromDate: "",
    ToDate: "",
    searchString: "",
  });
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const navigate = useNavigate();
  async function fetchrequestlogs() {
    try {
      setLoading(true);
      const fetchedapiloglist = await ConfigureSetingServices.requestloglist(
        filters
      );
      setrequestlogdata(fetchedapiloglist);
      setLoading(false);
    } catch (err) {
      console.log("🚀 ~ fetchrequestlogs ~ err:", err);
      setError(err);
      setLoading(false);
    }
  }

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
  useEffect(() => {
    fetchrequestlogs();
  }, []);

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const data = requestlogdata
    .filter(
      (item) =>
        JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
        -1
    )
    .map((filteredItem, index) => {
      const utcDate = filteredItem.timeStamp;
      const localDate = new Date(utcDate);

      const dateParts = localDate.toLocaleDateString().split("/");

      const formattedDate = `${dateParts[2]}-${dateParts[0]}-${
        dateParts[1]
      }, ${localDate.toLocaleTimeString()}`;

      return {
        id: index + 1,
        rowId: filteredItem.id,
        message: filteredItem.message,

        messageTemplate: filteredItem.messageTemplate || "No data available",

        timeStamp: formattedDate || "No data available",
        level: filteredItem.level || "No data available",
        exception: filteredItem.exception || "No data available",
        action: (
          <div className="d-flex gap-1">
            <Link to={`/request-log/${filteredItem.id}`} target="_blank">
              <Button color="btn btn-soft-success" className="btn-sm gap-1">
                <i className="bx bx-show" />
              </Button>
            </Link>
          </div>
        ),
      };
    });

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Request log list"
            pageTitle="Request log "
            // breadcrumbItems={breadcrumbItems}
          />

          <RequestFIlter
            requestlogdata={setrequestlogdata}
            setFilters={setFilters}
            fetchrequestlogs={fetchrequestlogs}
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
                  placeholder="Filter by Message, Message Template, Level, Date, Expection"
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
            paginationPerPage={50}
            paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
            persistTableHead
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => {
              window.open(`/request-log/${row.rowId}`, "_blank");
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
            columns={requestloglist}
            data={data}
          />
        </div>
      </React.Fragment>
    </Container>
  );
};

export default Requestloglist;
