import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  ButtonGroup,
  Input,
} from "reactstrap";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TablePagination from "../../Pages/Starter/Pagination";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
const EmailTemplategetlist = () => {
  const navigate = useNavigate();
  const [isEmailTemplate, setIsEmailTemplate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  async function fetchEmailTemplate() {
    try {
      const fetchedEmailTemplate =
        await ConfigureSetingServices.EmailTemplateList();
      setIsEmailTemplate(fetchedEmailTemplate);
      setLoading(false);
      console.log(fetchedEmailTemplate);
    } catch (err) {
      console.error("Error fetching Email-Template:", err);
    }
  }

  useEffect(() => {
    fetchEmailTemplate();
  }, []);

  const breadcrumbItems = [{ title: "Back to List ", link: "/email-setting" }];
  const columns = [
    {
      name: "Key",
      selector: (row) => row.key,
      width: "300px",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      width: "300px",
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      width: "200px",
      sortable: true,
    },
    {
      name: "Body",
      selector: (row) => row.body,
      width: "300px",
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link to={`/email-template/edit/${row.key}`}>
              <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                <i className="ri-edit-line" />
              </Button>
            </Link>
          </div>
        </ButtonGroup>
      ),
      width: "200px",
    },
  ];

  const data = isEmailTemplate
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.description.toLowerCase().includes(searchText) ||
        item.subject.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index,
      key: item.key,
      description: item.description,
      subject: item.subject,
      body: item.body,
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const handleClearFilter = () => {
    setFilterText("");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Email Template"
            pageTitle="Setting "
            breadcrumbItems={breadcrumbItems}
          />

          <Row>
            <div className="d-flex pb-2 gap-1">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by instruction or description"
                />
              </Col>
              <Col lg={2}>
                <Button
                  color="btn btn-soft-primary"
                  className="btn-md gap-1"
                  size="md"
                  onClick={handleClearFilter}
                >
                  Search
                </Button>
              </Col>
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
            progressPending={loading}
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
            columns={columns}
            data={data}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmailTemplategetlist;
