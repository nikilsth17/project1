import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
import TablePagination from "../../Pages/Starter/Pagination";
import { Triangle } from "react-loader-spinner";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import DataTable from "react-data-table-component";

const ServiceSettingViewDetail = () => {
  const { name } = useParams();
  console.log("Name:", name);

  const [isEmail, setIsEmail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const fetchEmail = async (itemName) => {
    try {
      const emailData = await ConfigureSetingServices.getAramax(itemName);
      setIsEmail(emailData);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching email data:", error);
    }
  };

  useEffect(() => {
    fetchEmail(); // You can directly call the function here
  }, []); // Empty dependency array to run only once after the component mounts

  const breadcrumbItems = [
    {
      title: "Back to List",
      link: "/service-setting",
    },
  ];
  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const handleClearFilter = () => {
    setFilterText("");
  };

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

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },

    {
      name: "Name",
      selector: (row) => row.name,

      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.value,

      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,

      sortable: true,
    },
    // {
    //   name: "OverWeight Rate",
    //   selector: (row) => row.overweight,

    //   sortable: true,
    // },
    // {
    //   name: "Oversize Rate",
    //   selector: (row) => row.oversize,

    //   sortable: true,
    // },
    // {
    //   name: "Signature Rate",
    //   selector: (row) => row.signature,

    //   sortable: true,
    // },
    // {
    //   name: "Extra Fuel Charge Rate",
    //   selector: (row) => row.signature,

    //   sortable: true,
    // },
    // {
    //   name: "Extra Fuel Charge Rate",
    //   selector: (row) => row.signature,

    //   sortable: true,
    // },

    // {
    //   name: "Domestic Dead weight",
    //   selector: (row) => row.domesticdead,

    //   sortable: true,
    // },
    // {
    //   name: "Domestic volumetric weight",
    //   selector: (row) => row.domesticvolumetric,

    //   sortable: true,
    // },

    {
      name: "Action",
      cell: (row) => row.action,
      width: "100px",
      sortable: true,
    },
  ];

  const data = isEmail
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchText) ||
        item.value.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index + 1,
      name: item.name,
      value: item.value,
      description: item.description,
      // overweight: item.overweight,
      // oversize: item.oversize,
      // signature: item.signature,
      // extrafuel: item.extrafuel,
      // domesticdead: item.domesticdead,
      // domesticvolumetric: item.domesticvolumetric,
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link
              to={`/service-setting/edit/${item.name}`} // Change 'setting.name' to 'item.name'
              state={{ setting: item }} // Pass the item as the setting
            >
              <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                <i className="ri-edit-line"></i>
              </Button>
            </Link>
          </div>
        </ButtonGroup>
      ),
    }));

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Aramax Setting"
          breadcrumbItems={breadcrumbItems}
          pageTitle=" Setting "
        />

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
            <Col lg={2}>
              <Button
                color="btn btn-soft-primary"
                className="btn-md gap-1"
                size="md"
                onClick={handleClearFilter}
              >
                Search
              </Button>
            </Col>
          </div>
        </Row>
        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
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
    </Container>
  );
};

export default ServiceSettingViewDetail;
