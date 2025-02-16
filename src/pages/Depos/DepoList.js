import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Container, Row, Col, Button, ButtonGroup, Input } from "reactstrap";
import { Triangle } from "react-loader-spinner";
import DepoService from "../../services/AustServices/DepoServices/Depo";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";

const DepoList = () => {
  const navigate = useNavigate();
  const [depooffice, setdepooffice] = useState([]);
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

  async function fetchCustomers() {
    try {
      const fetchedCustomers = await DepoService.getList();
      console.log("🚀 ~ fetchCustomers ~ fetchedCustomers:", fetchedCustomers);
      setdepooffice(fetchedCustomers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Depot Offices:", err);
    }
  }

  const handleDelete = async (depotId) => {
    try {
      if (window.confirm("Do you really want to delete Depot Office?")) {
        const deletedDepot = await DepoService.delete(depotId);
        console.log(
          `Depot Office deleted successfully: ${JSON.stringify(deletedDepot)}`
        );
        setdepooffice((prevDepotList) =>
          prevDepotList.filter((depot) => depot.id !== depotId)
        );
        toast.success("Depot Office Deleted Successfully", { autoClose: 3000 });
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting Depot Office:", error);
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
      title: (
        <Button className="btn btn-soft-success">+ New Depot Office</Button>
      ),
      link: "/depot-office/create",
    },
  ];
  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "75px" },

    {
      name: "Depo",
      selector: (row) => (row.name ? row.name : "No data available"),

      sortable: true,
    },
    {
      name: "Office Code",
      selector: (row) =>
        row.officeCode ? row.officeCode : "No data available",
      width: "145px",
      sortable: true,
    },

    {
      name: "Locality",
      selector: (row) => (row.locality ? row.locality : "No data available"),
      sortable: true,
      width: "200px",
    },

    {
      name: "PostalCode Starting",
      selector: (row) =>
        row.postalCodeStartingWith.length > 0
          ? row.postalCodeStartingWith.map((item) => item.code).join(", ")
          : "No data available",
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => row.action,
    },
  ];
  const data = depooffice
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchText) ||
        item.locality.toLowerCase().includes(searchText) ||
        item.officeCode.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index + 1,

      name: item.name,
      officeCode: item.officeCode,
      locality: `${item.locality}, ${item.state}, ${item.postalCode}`,

      postalCodeStartingWith: item.postalCodeStartingWith,

      action: (
        <ButtonGroup size="sm">
          <Link to={`/depot-office/details/${item.id}`}>
            <Button color="btn btn-soft-success" className="btn-sm gap-1">
              <i className="bx bx-show" />
            </Button>
          </Link>
          <Link to={`/depot-office/edit/${item.id}`}>
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
          title="Depot Office List"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Depot Office"
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Depo, Locality & Office code"
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
          highlightOnHover
          pointerOnHover
          persistTableHead
          progressPending={loading}
          paginationPerPage={50}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
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
    </Container>
  );
};

export default DepoList;
