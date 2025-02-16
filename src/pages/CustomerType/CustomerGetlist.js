import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb.js";
import { Container, Row, Col, Input, Button, ButtonGroup } from "reactstrap";
import { Triangle } from "react-loader-spinner";
import StatusLabel from "../../Components/sebscommon/StatusLabel.js";
import CustomerTypeServices from "../../services/Inventory Services/CustomerTypeServices.js";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";

const CustomerGetlist = () => {
  const navigate = useNavigate();
  const [saleCustomers, setSaleCustomers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  async function fetchCustomers() {
    try {
      const fetchedCustomers = await CustomerTypeServices.getList();
      setSaleCustomers(fetchedCustomers);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }

  const handleDelete = async (customerId) => {
    try {
      if (window.confirm("Do you really want to delete Service?")) {
        await CustomerTypeServices.delete(customerId);
        setSaleCustomers((prevCustomerList) =>
          prevCustomerList.filter((customer) => customer.id !== customerId)
        );
        toast.danger("Customer Type Deleted Successfully", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const breadcrumbItems = [
    {
      title: (
        <Button className="btn btn-soft-success">+ New Customer Type</Button>
      ),
      link: "/customer-type/create",
    },
  ];

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    { name: "Customer Type", selector: (row) => row.title, width: "130px" },

    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      grow: 2,
      width: "250px",
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      grow: 2,
    },
    {
      name: "International Discount",
      selector: (row) => row.discountPercentage,
      sortable: true,
      width: "200px",
      grow: 2,
    },
    {
      name: "Domestic Additional Charge",
      selector: (row) => row.additionalCharge,
      sortable: true,
      width: "200px",
      grow: 2,
    },

    {
      name: "Due Days",
      selector: (row) => row.dueDays,
      grow: 2,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      selector: (row) => row.action,
    },
  ];

  const data = saleCustomers
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index + 1,
      title: <Link to={`/customer-type/details/${item.id}`}>{item.title}</Link>,
      description: item.description,
      code: item.code,
      discountPercentage: <span>{item.discountPercentage}%</span>,
      additionalCharge: item.additionalCharge,
      dueDays: item.dueDays,
      status: (
        <StatusLabel
          text={item.status ? "Active" : "InActive"}
          isTaxable={item.status}
        />
      ),
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link
              to={`/customer-type/delete/${item.id}`}
              className="btn btn-soft-danger btn-sm"
              color="danger"
              onClick={() => handleDelete(item.id)}
            >
              <i className="ri-delete-bin-5-line" />
            </Link>
            <Link to={`/customer-type/edit/${item.id}`}>
              <Button color="btn btn-soft-warning" className="btn-sm">
                <i className="ri-edit-line" />
              </Button>
            </Link>
          </div>
        </ButtonGroup>
      ),
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  // const handleClearFilter = () => {
  //   setFilterText("");
  // };

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Customer Type List"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Customer Type"
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Customer Type  or Description"
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
          progressPending={loading}
          highlightOnHover
          customStyles={customStyles}
          pointerOnHover
          paginationPerPage={50}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
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
    </Container>
  );
};

export default CustomerGetlist;
