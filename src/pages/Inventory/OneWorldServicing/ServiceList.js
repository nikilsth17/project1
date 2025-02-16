import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OneWorldServices from "../../../services/Inventory Services/OneWorldServices";
import toast from "react-hot-toast";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import StatusLabel from "../../../Components/sebscommon/StatusLabel";
import TablePagination from "../../Pages/Starter/Pagination";
import { Container, Button, ButtonGroup, Input, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";

const ServiceList = () => {
  const [servicelist, setservicelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);

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

  const fetchservices = async () => {
    try {
      const fetchedservices = await OneWorldServices.getList();
      setservicelist(fetchedservices);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete Service?")) {
        await OneWorldServices.delete(productId);
        setservicelist((prevProductList) =>
          prevProductList.filter((product) => product.id !== productId)
        );
        toast.success("Service Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchservices();
    }, 1000);

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  const breadcrumbItems = [
    {
      title: <Button className="btn btn-soft-success">+ New Service</Button>,
      link: "/service-list/create",
    },
  ];

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Services",
      selector: (row) => row.title,
      width: "150px",
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      grow: 2,
      width: "100px",
    },
    {
      name: "Discount",
      selector: (row) => row.discountPercentage,
      sortable: true,
      grow: 2,
      width: "100px",
    },
    {
      name: "Extra Charge",
      selector: (row) => row.additionalCharge,
      sortable: true,
      width: "100px",
    },
    {
      name: "International Service Provider",
      selector: (row) => row.internationalServiceProviderName,
      sortable: true,

      width: "150px",
    },
    {
      name: "Domestic Service Provider",
      selector: (row) => row.domesticeServiceProviderName,
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "100px",
    },
    {
      name: "Action",
      selector: (row) => row.action,
      width: "200px",
    },
  ];

  const data = servicelist
    ?.filter((service) => {
      const searchText = filterText.toLowerCase();
      return (
        service.title.toLowerCase().includes(searchText) ||
        service.internationalServiceProviderName
          .toLowerCase()
          .includes(searchText) ||
        service.domesticeServiceProviderName.toLowerCase().includes(searchText)
      );
    })
    .map((service, index) => {
      return {
        id: index + 1,
        title: service.title,
        code: service.code,
        discountPercentage: `${service.discountPercentage}%`,
        additionalCharge: (
          <NumberWithCommas number={service.additionalCharge} />
        ),
        internationalServiceProviderName:
          service.internationalServiceProviderName,
        domesticeServiceProviderName: service.domesticeServiceProviderName,
        status: (
          <StatusLabel
            text={service.status ? "Active" : "InActive"}
            isTaxable={service.status}
          />
        ),
        action: (
          <td className="button">
            <ButtonGroup size="sm">
              <Link to={`/service-list/details/${service.id}`}>
                <Button
                  color="btn btn-soft-success"
                  className="btn-sm gap-1"
                  size="sm"
                >
                  <i className="bx bx-show" />
                </Button>
              </Link>
              <Link to={`/service-list/edit/${service.id}`}>
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

  // const handleClearFilter = () => {
  //   setFilterText("");
  // };

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Service List"
          pageTitle="Service "
          breadcrumbItems={breadcrumbItems}
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Service or Domestic provider"
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
          paginationPerPage={50}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
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
          data={data}
        />
      </div>
    </Container>
  );
};

export default ServiceList;
