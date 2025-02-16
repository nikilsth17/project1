import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Container, Button, ButtonGroup, Input, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';

import { getLoggedInUser } from "../../../helpers/fakebackend_helper";
import CategoryServices from "../../../services/DibyaServices/CategoryServices/CategoryServices";

const CategoryList = () => {
  const [categoryList, setCategorylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const [isUsers, setIsUsers] = useState(false);
  const authUser = getLoggedInUser();
  const isAuthenticated = useSelector((state) => state.Auth.isAuthenticated);
  // Ensure authUser is defined and has associatedRoles
  const hasAdminRole = authUser?.user?.roles?.includes("SuperAdmin");

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

  useEffect(() => {
    const GeneralList = async () => {
      try {
        const fetchedServices = await CategoryServices.maincategory();
        const temp = fetchedServices.map((item, index) => {
          return {
            ...item,
            index: index + 1,
          };
        });
        setCategorylist(temp);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    GeneralList();
  }, []);

  const handleDelete = async (serviceId) => {
    try {
      if (window.confirm("Do you really want to delete this Category?")) {
        await CategoryServices.deletecategory(serviceId);
        setCategorylist((prevserviceList) =>
          prevserviceList.filter((service) => service.id !== serviceId)
        );
        toast.success("Category Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting Category:", error);
      toast.error("Failed to delete Category");
    }
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Main Category",
      selector: (row) => row.category_type,
      sortable: true,
      // grow: 2,
      // width: "150px",
    },
    {
      name: "Category",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Sub-Category",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      //grow: 2,
    },
    ...(hasAdminRole ? [
      {
        name: "Action",
        cell: (row) => row.action,
      }
    ] : []),
  ];

  const filteredData = categoryList
    .filter((service) => {
      const searchText = filterText.toLowerCase();
      return (
        service.title.toLowerCase().includes(searchText) ||
        service.category_type.toLowerCase().includes(searchText)
      );
    })
    .map((service, index) => {
      return {
        index: index + 1,
        title: service.title,
        category_type: service.category_type,
        categoryName: service.categoryName,
        description: service.description,
        action: (
          <td className="button">
            <ButtonGroup size="sm">
              <Link to={`/category/edit/${service.id}`}>
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
                onClick={() => handleDelete(service.id)}
                size="sm"
              >
                <i className="ri-delete-bin-5-line" />
              </Button>
            </ButtonGroup>
          </td>
        ),
      };
    });

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Category List"
          pageTitle="Category "
          breadcrumbItems={[
            ...(hasAdminRole ? [
              {
                title: (
                  <Button className="btn btn-soft-success">+ New Category</Button>
                ),
                link: "/category/add",
              }
            ] : []),
            // {
            //   title: (
            //     <Button className="btn btn-soft-success">+ New Categorye</Button>
            //   ),
            //   link: "/category/add",
            // },
          ]}
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                name={filterText}
                onChange={handleFilter}
                placeholder="Filter by Category and Sub-Category"
              />
            </Col>
          </div>
        </Row>

        <DataTable
          responsive
          striped
          pagination
          fixedCategory
          paginationResetDefaultPage={resetPaginationToggle}
          persistTableHead
          highlightOnHover
          pointerOnHover
          customStyles={customStyles}
          progressPending={loading}
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
          data={filteredData}
        />
      </div>
    </Container>
  );
};

export default CategoryList;
