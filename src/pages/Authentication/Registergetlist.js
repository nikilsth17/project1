import React, { useState, useEffect } from "react";
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
  Input,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TablePagination from "../Pages/Starter/Pagination";
import AuthenticationsServices from "../../services/AuthenticationService/AuthenticationsServices";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";

const Registergetlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saleCustomers, setSaleCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [loading, setLoading] = useState(true);
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
      const fetchedCustomers = await AuthenticationsServices.userRoleManage();
      setSaleCustomers(fetchedCustomers);
      console.log(fetchedCustomers);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }

  const handleDelete = async (userId) => {
    try {
      if (window.confirm("Do you really want to delete User?")) {
        const deleteduser = await AuthenticationsServices.delete(userId);
        console.log(
          `User deleted successfully: ${JSON.stringify(deleteduser)}`
        );
        setSaleCustomers((prevuserList) =>
          prevuserList.filter((user) => user.id !== userId)
        );
        toast.success("User Deleted Successfully", { autoClose: 3000 });
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting User:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const breadcrumbItems = [
    {
      title: <Button className="btn btn-soft-success">+ New User</Button>,
      link: "/User-Role/create",
    },
  ];

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "70px",
    },
    {
      name: "User",
      selector: (row) => row.user.userName,
      width: "300px",
      sortable: true,
    },
    {
      name: "E-mail",
      selector: (row) => row.user.email,
      width: "300px",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.roles,
      width: "150px",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => row.action,
    },
  ];

  const data = saleCustomers
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.user.userName.toLowerCase().includes(searchText) ||
        item.user.email.toLowerCase().includes(searchText) ||
        (typeof item.roles === "string" &&
          item.roles.toLowerCase().includes(searchText)) ||
        (Array.isArray(item.roles) &&
          item.roles.some((role) => role.toLowerCase().includes(searchText)))
      );
    })
    .map((item, index) => {
      const isGeneralAdmin = item.roles === "GeneralAdmin";
      const isSuperAdmin = item.roles === "SuperAdmin";

      // Determine if the current user is the same as the user in this item
      const isCurrentUser = item.user.userName === id;
      const isCurrentSuperAdmin = isSuperAdmin && isCurrentUser;

      return {
        index: index + 1,
        user: {
          userName: item.user.userName,
          email: item.user.email,
        },
        roles: item.roles,
        action: (
          <ButtonGroup size="sm">
            <div className="d-flex gap-1">
              <Link to={`/User-Role/edit/${item.user.id}`}>
                <Button
                  color="btn btn-soft-warning"
                  className="btn-sm gap-1"
                  disabled={isGeneralAdmin || isCurrentSuperAdmin}
                >
                  <i className="ri-edit-line" />
                </Button>
              </Link>
              <Button
                className="btn btn-soft-danger btn-sm gap-1"
                color="danger"
                onClick={() => handleDelete(item.user.id)}
                disabled={isGeneralAdmin || isCurrentSuperAdmin}
              >
                <i className="ri-delete-bin-5-line" />
              </Button>
            </div>
          </ButtonGroup>
        ),
      };
    });

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
                placeholder="Filter by User, Email & Role"
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
          customStyles={customStyles}
          progressPending={loading}
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

export default Registergetlist;
