import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import PackageTypeServices from "../../../services/Inventory Services/PackageTypeServices";
import toast from "react-hot-toast";
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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import StatusLabel from "../../../Components/sebscommon/StatusLabel";
import TablePagination from "../../Pages/Starter/Pagination";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";
const PackageTypeGetList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
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
  async function fetchPackages() {
    try {
      const fetchedPackages = await PackageTypeServices.getList();
      setPackages(fetchedPackages);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }
  const handleDelete = async (packageId) => {
    try {
      if (window.confirm("Do you really want to delete this package?")) {
        const deletedPackage = await PackageTypeServices.delete(packageId);
        console.log(
          `Package deleted successfully: ${JSON.stringify(deletedPackage)}`
        );
        setPackages((prevPackageList) =>
          prevPackageList.filter((pkg) => pkg.id !== packageId)
        );
        toast.success("Package Deleted Successfully", { autoClose: 3000 });
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPackages();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);
  const breadcrumbItems = [
    {
      title: (
        <Button
          className="btn btn-soft-success"
          onClick={() => navigate("/Package/create")}
        >
          + New Package
        </Button>
      ),
      link: "/Package/create",
    },
  ];

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "100px" },
    {
      name: "Package",
      selector: (row) => row.name,
      sortable: true,
      width: "210px",
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      width: "210px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "210px",
    },

    { name: "Action", selector: (row) => row.action, width: "210px" },
  ];

  const data = packages
    ?.filter((pkg) => {
      const searchText = filterText.toLowerCase();
      return pkg.name && pkg.name.toLowerCase().includes(searchText);
    })
    .map((pkg, index) => ({
      id: index + 1,
      name: pkg.name,

      code: pkg.code,

      status: (
        <StatusLabel
          text={pkg.status ? "Active" : "InActive"}
          isTaxable={pkg.status}
        />
      ),
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link to={`/Package/edit/${pkg.id}`}>
              <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                <i className="ri-edit-line" />
              </Button>
            </Link>
            <Button
              className="btn btn-soft-danger btn-sm gap-1"
              color="danger"
              onClick={() => handleDelete(pkg.id)}
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
            title="Package List"
            pageTitle="Package "
            breadcrumbItems={breadcrumbItems}
          />

          <Row>
            <div className="d-flex pb-2 gap-1">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Package Name"
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
      </React.Fragment>
    </Container>
  );
};
export default PackageTypeGetList;
