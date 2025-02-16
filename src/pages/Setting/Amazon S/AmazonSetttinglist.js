import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TablePagination from "../../Pages/Starter/Pagination";
import AmazonServices from "../../../services/AustServices/Amazon/AmazonServices";
import Pagination from "../../../Components/Common/Pagination";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";
const AmazonSetttinglist = () => {
  const [amazonSettings, setAmazonSettings] = useState([]);
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
  async function fetchAmazonSettings() {
    try {
      const fetchedSettings = await AmazonServices.getAmazon();
      setAmazonSettings(fetchedSettings);
      setLoading(false);
      console.log(fetchedSettings);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAmazonSettings();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    {
      title: "Back to List",
      link: "/amazon-setting",
    },
  ];
  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "200px",
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.value,
      width: "200px",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      width: "400px",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => row.action,
      width: "100px",
    },
  ];

  const data = amazonSettings
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index + 1,
      name: item.name,
      value: index === 1 ? "" : item.value,
      description: item.description,
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link
              to={`/service-setting/edit/${item.name}`}
              state={{ setting: item }}
            >
              <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                <i className="ri-edit-line"></i>
              </Button>
            </Link>
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
          <BreadCrumb title="Amazon Setting" pageTitle="Setting " />
          <Row>
            <div className="d-flex pb-2 gap-1">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Name & description"
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
            persistTableHead
            highlightOnHover
            pointerOnHover
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

export default AmazonSetttinglist;
