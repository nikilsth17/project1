import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import StatusLabel from "../../../Components/sebscommon/StatusLabel";
import { Container, Button, ButtonGroup, Input, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import RateCardServices from "../../../services/AustServices/RateCardServices";
import toast from "react-hot-toast";
const RateCardList = () => {
  const [rateCardList, setRateCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchRateCard = async () => {
      try {
        const fetchedServices = await RateCardServices.getList();
        const temp = fetchedServices.map((item, index) => {
          return {
            ...item,
            index: index + 1,
          };
        });
        setRateCardList(temp);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchRateCard();
  }, []);

  const handleDelete = async (serviceId) => {
    try {
      if (window.confirm("Do you really want to delete this Rate Card?")) {
        await RateCardServices.delete(serviceId);
        setRateCardList((prevserviceList) =>
          prevserviceList.filter((service) => service.id !== serviceId)
        );
        toast.success("Rate Card Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting Rate Card:", error);
      toast.error("Failed to delete Rate Card");
    }
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "70px",
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`data:image/jpeg;base64, ${row.image}`}
          alt="Image"
          style={{ width: "100px", height: "auto" }}
        />
      ),
      sortable: true,
      width: "200px",
    },
    {
      name: "Domestic Service Provider",
      selector: (row) => row.domesticServiceProvider,
      width: "200px",
    },
    {
      name: "International Service Provider",
      selector: (row) => row.intlServiceProvider,
      sortable: true,
      grow: 2,
      width: "200px",
    },
    {
      name: "Active",
      selector: (row) => row.signature,
      sortable: true,
      grow: 2,
      width: "200px",
    },
    {
      name: "Action",
      cell: (row) => row.action,
      width: "150px",
    },
  ];

  const filteredData = rateCardList
    .filter((service) => {
      const searchText = filterText.toLowerCase();
      return (
        service.domesticServiceProvider.toLowerCase().includes(searchText) ||
        service.intlServiceProvider.toLowerCase().includes(searchText)
      );
    })
    .map((service, index) => {
      return {
        index: index + 1,
        image: service.image,
        domesticServiceProvider: service.domesticServiceProvider,
        intlServiceProvider: service.intlServiceProvider,
        signature: (
          <StatusLabel
            text={service.signature ? "True" : "False"}
            isTaxable={service.signature}
          />
        ),
        action: (
          <td className="button">
            <ButtonGroup size="sm">
              <Link to={`/ratecard/edit/${service.id}`}>
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
          title="Rate Card List"
          pageTitle="Rate Card "
          breadcrumbItems={[
            {
              title: (
                <Button className="btn btn-soft-success">
                  + New Rate Card
                </Button>
              ),
              link: "/ratecard/create",
            },
          ]}
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Domestic or International provider"
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
          data={filteredData}
        />
      </div>
    </Container>
  );
};

export default RateCardList;
