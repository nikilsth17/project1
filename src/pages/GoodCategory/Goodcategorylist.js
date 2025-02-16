import React, { useState, useEffect, useMemo } from "react";
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
import CreateButton from "../Pages/Starter/CreateButton"; // Corrected import
import TablePagination from "../Pages/Starter/Pagination";
import StatusLabel from "../../Components/sebscommon/StatusLabel";
import toast from "react-hot-toast";
import GoodCategoryServices from "../../services/AustServices/Good Category/GoodCategoryServices";
import Search from "../Pages/Starter/Search";
import Pagination from "../../Components/Common/Pagination";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";

const Goodcategorylist = () => {
  const navigate = useNavigate();
  const [goodcategory, setgoodcategory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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

  async function fetchGoodCategories() {
    try {
      const fetchedGoodCategories = await GoodCategoryServices.getList();
      setgoodcategory(fetchedGoodCategories);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }

  const handleDelete = async (categoryId) => {
    try {
      if (window.confirm("Do you really want to delete Category?")) {
        const deletedCategory = await GoodCategoryServices.delete(categoryId);
        setgoodcategory((prevCategoryList) =>
          prevCategoryList.filter((category) => category.id !== categoryId)
        );
        toast.success("Category Deleted Successfully", { autoClose: 3000 });
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting Category:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchGoodCategories();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const breadcrumbItems = [
    {
      title: <Button className="btn btn-soft-success">+ New Category</Button>,

      link: "/Categories/create",
    },
  ];

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "250px" },

    { name: "Name", selector: (row) => row.name, width: "250px" },
    { name: "Status", selector: (row) => row.status, width: "250px" },

    { name: "Action", selector: (row) => row.action, width: "250px" },
  ];

  const data = goodcategory
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return item.name.toLowerCase().includes(searchText);
    })
    .map((item, index) => ({
      id: index + 1,

      name: item.name,

      status: (
        <StatusLabel
          text={item.status ? "Active" : "InActive"}
          isTaxable={item.status}
        />
      ),
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link to={`/Categories/edit/${item.id}`}>
              <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                <i className="ri-edit-line" />
              </Button>
            </Link>
            <Button
              className="btn btn-soft-danger btn-sm gap-1"
              color="danger"
              onClick={() => handleDelete(item.id)}
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
            title="Good Category List"
            pageTitle="Good Category "
            breadcrumbItems={breadcrumbItems}
          />
          <Row>
            <div className="d-flex pb-2 gap-1">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Name"
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
            columns={columns}
            data={data}
          />
        </div>
      </React.Fragment>
    </Container>
  );
};

export default Goodcategorylist;
