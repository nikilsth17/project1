import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Col, Input, InputGroup, Row } from "reactstrap";
import CategoryServices from "../../../services/DibyaServices/CategoryServices/CategoryServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomDataTable from "../../../Components/CustomTable/CustomTable";
import { Triangle } from "react-loader-spinner";

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

const Unit = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [categorylist, setCategorylist] = useState([]);
  const navigate = useNavigate();

  const handleFilter = (event) => {
    setFilterText(event.target.value);
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Image",
      selector: (row) =>
        row?.imageBase64 ? (
          <img
            // src={`data:image/jpeg;base64, ${row.base64Image}`}
            src={`data:image/jpeg;base64,${row.imageBase64}`}
            alt="Image"
            style={{ width: "100px", height: "auto" }}
          />
        ) : null,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Parent Category",
      selector: (row) => row.parentName || "None",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span className={`badge ${row.isActive ? "bg-success" : "bg-danger"}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || "None",
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <ButtonGroup size="sm">
            <Link to={`/category/edit/${row.id}`}>
              <Button
                color="btn btn-soft-warning"
                className="btn-sm gap-1 ms-1"
                size="sm"
              >
                <i className="ri-edit-line" />
              </Button>
            </Link>
            <Button
              className="btn btn-soft-danger btn-sm gap-1 ms-1"
              color="danger"
              onClick={() => handleDelete(row.id)}
              size="sm"
            >
              <i className="ri-delete-bin-5-line" />
            </Button>
          </ButtonGroup>
        </div>
      ),
      center: true,
    },
  ];

  const data = categoryList
    .filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      ...item,
      index: index + 1,
    }));

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await CategoryServices.maincategory();
        setCategoryList(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (serviceId) => {
    try {
      if (window.confirm("Do you really want to delete this Category?")) {
        await CategoryServices.deletecategory(serviceId);

        // Fetch the updated category list after deletion
        const response = await CategoryServices.maincategory();
        setCategoryList(response.data);

        toast.success("Category Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting Category:", error);
      toast.error("Failed to delete Category");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb
          title="Administrative List"
          pageTitle="Administrative Unit"
        />
      </div>

      <Row className="mb-2">
        <Col lg={5}>
          <InputGroup>
            <Input
              placeholder="Search by name or description"
              value={filterText}
              onChange={handleFilter}
            />
          </InputGroup>
        </Col>
        <Col lg={7}>
          <div className="d-flex justify-content-end">
            <Button
              className="btn btn-success"
              onClick={() => navigate("/category/add")}
            >
              + Create category
            </Button>
          </div>
        </Col>
      </Row>
      <CustomDataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        progressPending={loading}
        customStyles={customStyles}
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
  );
};

export default Unit;
