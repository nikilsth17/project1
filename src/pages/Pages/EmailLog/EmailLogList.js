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
  Modal,
  ModalHeader,
  ModalBody,
  Badge,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import AapilogFIlter from "./Filter/EmailLogFilter";
import { Link } from "react-router-dom";
import EmailLogServices from "../../../services/AustServices/EmailLogServices/EmailLogServices";
import HTMLTagRemover from "../../../common/utils/HTMLTagRemover";
import EmailModal from "./components/EmailModal";
import EmailLogFilter from "./Filter/EmailLogFilter";
const EmailLogList = () => {
  const [emailLog, setEmailLogs] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [totalData, setTotalData] = useState();
  const [email, setEmail] = useState({
    from: "",
    to: "",
    date: "",
    subject: "",
    message: "",
    status: "",
  });
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "",
    filterString: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const handleModelOpen = () => {
    setModelOpen(!modelOpen);
  };

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
  async function fetchEmailLogs(filters) {
    try {
      setLoading(true);
      const response = await EmailLogServices.getEmailLogs({ ...filters });
      setEmailLogs(response);
      setTotalData(response.totalData);
      setLoading(false);
    } catch (err) {
      console.log("🚀 ~ fetchEmailLogs ~ err:", err);
      setError(err);
      setLoading(false);
    }
  }

  const handlePageChange = (page) => {
    fetchEmailLogs({ ...filters, pageNumber: page });
    setFilters((prev) => {
      return {
        ...prev,
        pageNumber: page,
      };
    });
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchEmailLogs({ ...filters, pageNumber: page, pageSize: newPerPage });
    setFilters((prev) => {
      return {
        ...prev,
        pageSize: newPerPage,
      };
    });
  };

  useEffect(() => {
    fetchEmailLogs(filters);
  }, []);

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const handleClearFilter = () => {
    setFilterText("");
  };

  const emailLogColumn = [
    {
      name: "S.N",
      selector: (row) => row.id,
      sortable: true,
      width: "75px",
    },
    {
      name: "Date",
      selector: (row) => (
        <span
          onClick={() => {
            setEmail({
              from: row.from,
              to: row.to,
              subject: row.subject,
              message: HTMLTagRemover(row.message),
              date: row.date,
              status: row.status,
            });
            handleModelOpen();
          }}
        >
          {row.date}
        </span>
      ),
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => (
        <span
          onClick={() => {
            setEmail({
              from: row.from,
              to: row.to,
              subject: row.subject,
              message: HTMLTagRemover(row.message),
              date: row.date,
              status: row.status,
            });
            handleModelOpen();
          }}
          title={row.from}
        >
          {row.from}
        </span>
      ),
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => (
        <span
          onClick={() => {
            setEmail({
              from: row.from,
              to: row.to,
              subject: row.subject,
              message: HTMLTagRemover(row.message),
              date: row.date,
              status: row.status,
            });
            handleModelOpen();
          }}
          title={row.to}
        >
          {row.to}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => (
        <span
          onClick={() => {
            setEmail({
              from: row.from,
              to: row.to,
              subject: row.subject,
              message: HTMLTagRemover(row.message),
              date: row.date,
              status: row.status,
            });
            handleModelOpen();
          }}
          title={row.subject}
        >
          {row.subject}
        </span>
      ),
      sortable: true,
    },

    // {
    //   name: "Message",
    //   selector: (row) => (
    //     <span
    //       onClick={() => {
    //         setEmail({
    //           from: row.from,
    //           to: row.to,
    //           subject: row.subject,
    //           message: HTMLTagRemover(row.message),
    //           date: row.date,
    //           status: row.status,
    //         });
    //         handleModelOpen();
    //       }}
    //       className="cursor-pointer"
    //     >
    //       {HTMLTagRemover(row.message)}
    //     </span>
    //   ),
    //   sortable: true,
    //   width: "200px",
    // },
  ];

  const data = emailLog.data
    ?.filter(
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
        date: new Date(filteredItem.date).toLocaleString(),
        from: filteredItem.from,
        to: filteredItem.to,
        message: filteredItem.message,
        subject: filteredItem.subject,
        status: filteredItem.emailSend,
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
          <EmailLogFilter
            filters={filters}
            setFilters={setFilters}
            loading={loading}
            fetchEmailLogs={fetchEmailLogs}
          />
          {/* <AapilogFIlter
            emailLog={setEmailLogs}
            setFilters={setFilters}
            fetchEmailLogs={fetchEmailLogs}
            filters={filters}
            loading={loading}
          /> */}
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
            </div>
          </Row>
          <DataTable
            responsive
            striped
            pagination
            fixedHeader
            persistTableHead
            highlightOnHover
            paginationPerPage={50}
            pointerOnHover
            progressPending={loading}
            customStyles={customStyles}
            paginationResetDefaultPage={resetPaginationToggle}
            paginationServer
            paginationTotalRows={totalData}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            // selectableRows
            paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
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
            columns={emailLogColumn}
            data={data}
          />
        </div>
      </React.Fragment>

      <EmailModal
        email={email}
        handleModelOpen={handleModelOpen}
        modelOpen={modelOpen}
      />
    </Container>
  );
};

export default EmailLogList;
