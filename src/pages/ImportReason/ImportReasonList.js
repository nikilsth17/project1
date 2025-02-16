import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
import { Triangle } from "react-loader-spinner";
import ImportReasonService from "../../services/AustServices/ImportReasonService";
import TablePagination from "../Pages/Starter/Pagination";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
const ImportReasonList = () => {
  const navigate = useNavigate();
  const [importgoods, setImportgoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  async function fetchitems() {
    try {
      const fetcheditems = await ImportReasonService.getList();
      setImportgoods(fetcheditems);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching import reasons:", err);
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
      if (window.confirm("Do you really want to delete this import reason?")) {
        const deletedProduct = await ImportReasonService.delete(productId);
        console.log(
          `Import Reason deleted successfully: ${JSON.stringify(
            deletedProduct
          )}`
        );
        setImportgoods((prevProductList) =>
          prevProductList.filter((product) => product.id !== productId)
        );
        toast.success("Import Reason Deleted Successfully", {
          autoClose: 3000,
        });
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting import reason:", error);
      toast.error("Failed to delete import reason");
    }
  };

  useEffect(() => {
    fetchitems();
  }, []);

  const breadcrumbItems = [
    {
      title: (
        <Button className="btn btn-soft-success">+ New Import Reason</Button>
      ),
      link: "/import-reason/create",
    },
  ];

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Title",
      selector: (row) => row.title,
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
      name: "Action",
      cell: (row) => row.action,
      width: "200px",
    },
  ];

  const data = importgoods
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index + 1,
      title: item.title,
      description: item.description,

      action: (
        <ButtonGroup size="sm">
          <Link to={`/import-reason/edit/${item.id}`}>
            <Button color="btn btn-soft-warning" className="btn-sm gap-1">
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
          title="Import Reason List"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Import Reason"
        />
        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Title & Description"
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
          paginationPerPage={50}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
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
    </Container>
  );
};

export default ImportReasonList;
