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
import toast from "react-hot-toast";
import TablePagination from "../../Pages/Starter/Pagination";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";
import OneWorldServices from "../../../services/Inventory Services/OneWorldServices";
// import CurrencyDisplay from "../../../common/display";

const ServiceSetting = () => {
  const { name } = useParams();

  const [servicedata, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editableSetting, setEditableSetting] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const fetchServiceData = async () => {
    try {
      const Data = await OneWorldServices.generalService();
      setServiceData(Data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching email data:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServiceData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // const enableEdit = (setting) => {
  //   setEditableSetting({ ...setting, isEditing: true });
  // };

  // const saveEditedSetting = async () => {
  //   try {
  //     await OneWorldServices.updateService(editableSetting);

  //     setEditableSetting(null);

  //     const updatedEmailData = await OneWorldServices.generalService();
  //     setIsEmail(updatedEmailData);
  //     toast.success("Additional charge updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating additional charge:", error);
  //     toast.error("Failed to update additional charge!");
  //   }
  // };

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
    { name: "S.N", selector: (row) => row.sn, sortable: true, width: "80px" },
    { name: "Action", cell: (row) => row.action, width: "150px" },

    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "130px",
    },
    {
      name: "Additional Charge",
      selector: (row) => row.value,
      sortable: true,
      right: true,
    },
    {
      name: "Signature Rate",
      selector: (row) => row.signatureRate,
      sortable: true,
      right: true,
    },
    {
      name: "ExtraFuel ChargeRate",
      selector: (row) => row.extraFuelChargeRate,
      sortable: true,
      right: true,
    },
    {
      name: "Oversize Rate",
      selector: (row) => row.overSizeRate,
      sortable: true,
      right: true,
    },
  ];

  const data = servicedata
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return item.name.toLowerCase().includes(searchText);
    })
    .map((item, index) => ({
      sn: index + 1,
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Link to={`/service-setting/details/${item.name}`}>
              <Button color="btn btn-soft-success" className="btn-sm gap-1">
                <i className="bx bx-show" />
              </Button>
            </Link>
            <Link to={`/serviceextra-list/edit/${item.id}`}>
              <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                <i className="ri-edit-line" />
              </Button>
            </Link>
            <Link to={`/serviceextra-list/${item.id}`}>
              <Button color="btn btn-soft-primary" className="btn-sm gap-1">
                <i className="bx bxs-report"></i>
              </Button>
            </Link>
          </div>
        </ButtonGroup>
      ),

      id: item.id,
      name: item.name,
      value:
        editableSetting &&
        editableSetting.isEditing &&
        editableSetting.name === item.name ? (
          <input
            type="text"
            value={editableSetting.additionalCharge}
            className="form-control"
            onChange={(e) =>
              setEditableSetting({
                ...editableSetting,
                additionalCharge: e.target.value,
              })
            }
          />
        ) : (
          item.additionalCharge.toLocaleString("en-US")
        ),
      signatureRate: item.signatureRate.toLocaleString("en-US"),
      extraFuelChargeRate: item.extraFuelChargeRate.toLocaleString("en-US"),
      overSizeRate: item.overSizeRate.toLocaleString("en-US"),
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb title="Service Setting List" pageTitle=" Setting " />
        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Name "
              />
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
          highlightOnHover
          pointerOnHover
          progressComponent={
            <div className="my-2">
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
          paginationResetDefaultPage={resetPaginationToggle}
          columns={columns}
          data={data}
        />
      </div>
    </Container>
  );
};

export default ServiceSetting;
