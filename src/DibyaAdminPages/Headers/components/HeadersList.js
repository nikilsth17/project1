import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Container, Button, ButtonGroup, Input, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import RateCardServices from "../../../services/AustServices/RateCardServices";
import toast from "react-hot-toast";
import HeaderServices from "../../../services/DibyaServices/HeaderServices/HeaderServices";

const HeadersList = () => {
  const [headerList, setheaderList] = useState([]);
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
    const GeneralList = async () => {
      try {
        const fetchedServices = await HeaderServices.headersList();
        const temp = fetchedServices.map((item, index) => {
          return {
            ...item,
            index: index + 1,
          };
        });
        setheaderList(temp);
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
      if (window.confirm("Do you really want to delete this Header?")) {
        await HeaderServices.deleteheaders(serviceId);
        setheaderList((prevserviceList) =>
          prevserviceList.filter((service) => service.id !== serviceId)
        );
        toast.success("Header Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting Header:", error);
      toast.error("Failed to delete Header");
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
      name: "Title",
      selector: (row) => row.title,
      // width: "200px",
    },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
      grow: 2,
      // width: "200px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      grow: 2,
    },

    {
      name: "Action",
      cell: (row) => row.action,
    },
  ];

  const filteredData = headerList
    .filter((service) => {
      const searchText = filterText.toLowerCase();
      return (
        service.title.toLowerCase().includes(searchText) ||
        service.value.toLowerCase().includes(searchText)
      );
    })
    .map((service, index) => {
      return {
        index: index + 1,
        title: service.title,
        value: service.value,
        description: service.description,

        action: (
          <td className="button">
            <ButtonGroup size="sm">
              <Link to={`/headers/edit/${service.id}`}>
                <Button
                  color="btn btn-soft-warning"
                  className="btn-sm gap-1 ms-1"
                  size="sm"
                >
                  <i className="ri-edit-line" />
                </Button>
              </Link>
              {/* <Button
                className="btn btn-soft-danger btn-sm gap-1 ms-1"
                color="danger"
                onClick={() => handleDelete(service.id)}
                size="sm"
              >
                <i className="ri-delete-bin-5-line" />
              </Button> */}
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
          title="Header List"
          pageTitle="Header "
          breadcrumbItems={[
            {
              // title: (
              //   <Button className="btn btn-soft-success">+ New Header</Button>
              // ),
              link: "/headers/add",
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
                placeholder="Search by Slogan or Value"
              />
            </Col>
          </div>
        </Row>

        <DataTable
          responsive
          striped
          pagination
          fixedHeader
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

export default HeadersList;
