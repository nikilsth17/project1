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

import toast from "react-hot-toast";

import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";
import SpecialOccasionServices from "../../services/DibyaServices/SpecialOccasionServices/SpecialOccasionServices";

const SpecialOccasionList = () => {
  const navigate = useNavigate();
  const [special, setSpecial] = useState([]);
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
      const fetchedGoodCategories = await SpecialOccasionServices.specialList();
      setSpecial(fetchedGoodCategories);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }

  const handleDelete = async (categoryId) => {
    try {
      if (window.confirm("Do you really want to delete Category?")) {
        const deletedCategory = await SpecialOccasionServices.deletespecial(
          categoryId
        );
        setSpecial((prevCategoryList) =>
          prevCategoryList.filter((category) => category.id !== categoryId)
        );
        toast.success("Special Occasion List Deleted Successfully", {
          autoClose: 3000,
        });
      } else {
      }
    } catch (error) {
      console.error("Error deleting Category:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchGoodCategories();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const breadcrumbItems = [
    {
      title: (
        <Button className="btn btn-soft-success">+ New Special Occasion</Button>
      ),

      link: "/special-occasion/add",
    },
  ];

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    { name: "Image", selector: (row) => row.image, width: "200px" },
    {
      name: "Specail Occasion Offer",
      selector: (row) => row.name,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      width: "200pxC",
    },
    { name: "Start Date", selector: (row) => row.startDate, width: "100px" },
    { name: "End Date", selector: (row) => row.endDate, width: "100px" },
    { name: "Action", selector: (row) => row.action, width: "100px" },
  ];

  const data = special
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return item.name.toLowerCase().includes(searchText);
    })
    .map((item, index) => ({
      id: index + 1,
      image: item.image,
      name: item.name,
      description: item.description,
      startDate: item.startDate.split("T")[0],
      endDate: item.endDate.split("T")[0],
      name: item.name,

      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link to={`/special-occasion/edit/${item.id}`}>
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

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Special Occasion List"
            pageTitle="Special Occasion "
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
            paginationRowsPerPageOptions={[10, 20, 50, 150, 500, 1500]}
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

export default SpecialOccasionList;
