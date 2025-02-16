import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb.js";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  ButtonGroup,
  Input,
} from "reactstrap";
import TablePagination from "../Pages/Starter/Pagination.js";
import toast from "react-hot-toast";
import CurrencyServices from "../../services/AustServices/CurrencySe/CurrencyServices.js";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";
const CurrencyGetlist = () => {
  const navigate = useNavigate();
  const [currency, setcurrency] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  async function fetchCustomers() {
    try {
      const fetchedCustomers = await CurrencyServices.getList();
      setcurrency(fetchedCustomers);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete Currency?")) {
        const deletedProduct = await CurrencyServices.delete(productId);
        console.log(
          `Currency deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setcurrency((prevProductList) =>
          prevProductList.filter((product) => product.id !== productId)
        );
        toast.success("Currency Deleted Successfully", { autoClose: 3000 });
      } else {
      }
    } catch (error) {
      console.error("Error deleting Currency:", error);
    }
  };

  useEffect(() => {
    // Simulate loading for 10 seconds
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  const breadcrumbItems = [
    {
      title: (
        <Link to="/Currency/create">
          <Button className="btn btn-soft-success">+ New Currency</Button>
        </Link>
      ),
      link: "/Currency/create",
    },
  ];

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Code",
      selector: (row) => row.currencyCode,
      width: "200px",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "200px",
      sortable: true,
    },
    {
      name: "Rate",
      selector: (row) => row.exchangeRate,
      width: "200px",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      width: "200px",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => row.action,
      width: "200px",
    },
  ];

  const data = currency
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.currencyCode.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText) ||
        item.name.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index + 1,
      currencyCode: item.currencyCode,
      name: item.name,
      exchangeRate: item.exchangeRate,
      description: item.description,
      action: (
        <ButtonGroup size="sm">
          <Link to={`/Currency/details/${item.id}`}>
            <Button color="btn btn-soft-success" className="btn-sm gap-1">
              <i className="bx bx-show" />
            </Button>
          </Link>
          <Link to={`/Currency/edit/${item.id}`}>
            <Button color="btn btn-soft-warning" className="btn-sm gap-1 ms-1">
              <i className="ri-edit-line" />
            </Button>
          </Link>
          <Button
            className="btn btn-soft-danger btn-sm gap-1 ms-1"
            color="danger"
            onClick={() => handleDelete(item.id)}
          >
            <i className="ri-delete-bin-5-line" />
          </Button>
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
          title="Currency List"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Currency"
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Name, Currency code & Description"
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
          highlightOnHover
          pointerOnHover
          paginationPerPage={50}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
          customStyles={customStyles}
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
    </Container>
  );
};

export default CurrencyGetlist;
