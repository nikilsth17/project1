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
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TablePagination from "../Pages/Starter/Pagination";
import AuthenticationsServices from "../../services/AuthenticationService/AuthenticationsServices";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";
const Rolesadminget = () => {
  const navigate = useNavigate();
  const [saleCustomers, setSaleCustomers] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  async function fetchCustomers() {
    try {
      const fetchedCustomers = await AuthenticationsServices.userRole();
      setSaleCustomers(fetchedCustomers);
      setLoading(false);
      console.log(fetchedCustomers);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    // Simulate loading for 10 seconds
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  const breadcrumbItems = [
    {
      // title: <Button className="btn btn-soft-success">+ New User</Button>,
      link: "/User-Role/create",
    },
  ];
  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Role",
      selector: (row) => row.name,
      width: "400px",
      sortable: true,
    },
    {
      name: "Normalized Name",
      selector: (row) => row.normalizedName,
      width: "400px",
      sortable: true,
    },
  ];

  const data = saleCustomers
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchText) ||
        item.normalizedName.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index + 1,
      name: item.name,
      normalizedName: item.normalizedName,
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            {/* Add your action buttons here */}
          </div>
        </ButtonGroup>
      ),
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
        <BreadCrumb
          title="User Role"
          pageTitle="User"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Role & Normaized name"
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
          highlightOnHover
          pointerOnHover
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
      </div>
    </React.Fragment>
  );
};

export default Rolesadminget;
