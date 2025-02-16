import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
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
  Form,
  FormGroup,
  Label,
  Input,
  ButtonToggle,
} from "reactstrap";
import toast from "react-hot-toast";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TablePagination from "../Pages/Starter/Pagination";
import CreateButton from "../Pages/Starter/CreateButton";
import StatusLabel from "../../Components/sebscommon/StatusLabel";
import InsuranceServices from "../../services/AustServices/Insuranceservice/InsuranceServices";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";
const InsuranceGetList = () => {
  const navigate = useNavigate();
  const [saleCustomers, setSaleCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  async function fetchCustomers() {
    try {
      const fetchedCustomers = await InsuranceServices.getList();
      setSaleCustomers(fetchedCustomers);
      setLoading(false);
    } catch (err) {
      setError(err);
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

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete Insurance?")) {
        const deletedProduct = await InsuranceServices.delete(productId);
        console.log(
          `Insurance deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setSaleCustomers((prevProductList) =>
          prevProductList.filter((product) => product.id !== productId)
        );
        toast.success("Insurance Deleted Successfully", { autoClose: 3000 });
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting Insurance:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    {
      title: <Button className="btn btn-soft-success">+ New Insurance</Button>,
      link: "/Insurance/create",
    },
  ];

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Entities",
      selector: (row) => row.title,
      sortable: true,
      width: "200px",
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      width: "100px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "200px",
    },
    {
      name: "Extra Charge",
      selector: (row) => row.additionalCharge,
      sortable: true,
      width: "100px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      width: "100px",
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => row.action,
      width: "200px",
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
    .map((customer, index) => ({
      id: index + 1,
      title: customer.title,
      code: customer.code,
      locality: customer.locality,
      description: customer.description,
      additionalCharge: customer.additionalCharge,
      status: (
        <StatusLabel
          text={customer.status ? "Active" : "InActive"}
          isTaxable={customer.status}
        />
      ),
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link to={`/Insurance/details/${customer.id}`}>
              <Button color="btn btn-soft-success" className="btn-sm gap-1">
                <i className="bx bx-show" />
              </Button>
            </Link>
            <Link to={`/Insurance/edit/${customer.id}`}>
              <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                <i className="ri-edit-line" />
              </Button>
            </Link>
            <Button
              className="btn btn-soft-danger btn-sm gap-1"
              color="danger"
              onClick={() => handleDelete(customer.id)}
            >
              <i className="ri-delete-bin-5-line" />
            </Button>
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
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Insurance List"
            pageTitle="Insurance "
            breadcrumbItems={breadcrumbItems}
          />
          <Row>
            <div className="d-flex pb-2 gap-1">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Entities & Description"
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
      </React.Fragment>
    </Container>
  );
};

export default InsuranceGetList;
