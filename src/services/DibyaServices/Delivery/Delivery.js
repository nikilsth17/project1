import React, { useState, useEffect } from "react";
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
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import { Link } from "react-router-dom";
import OrderServices from "../OrderServices/OrderServices";
import Filter from "./Filter";
const Delivery = () => {
  const [requestlogdata, setrequestlogdata] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    DeliveryDateFrom: "",
    DeliveryDateTo: "",
  });
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  async function fetchrequestlogs() {
    try {
      setLoading(true);
      const fetchedapiloglist = await OrderServices.getDelivery(filters);
      setrequestlogdata(fetchedapiloglist);
      setLoading(false);
    } catch (err) {
      console.log("🚀 ~ fetchrequestlogs ~ err:", err);
      setError(err);
      setLoading(false);
    }
  }

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
    fetchrequestlogs();
  }, []);

  const handleFilter = (e) => {
    const searchText = e.target.value.toLowerCase();
    setFilterText(searchText);
  };

  const filteredData = requestlogdata.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" && value.toLowerCase().includes(filterText)
    )
  );
  const statusColors = {
    Ongoing: "bg-primary",
    Received: "bg-warning",
    Processing: "bg-success",
    Processed: "bg-danger",
    Delivered: "bg-info",
    Cancelled: "bg-danger",
  };

  const statusColors1 = {
    Paid: "bg-primary",
    Unpaid: "bg-warning",
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },

    {
      name: "Customer",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Order Reference",
      cell: (row) => <Link to={`/orders/${row.id}`}>{row.orderRef}</Link>,
      sortable: true,
      width: "250px",
    },

    {
      name: "Created Date",
      cell: (row) => row.createdDate,
      sortable: true,
      // width: "200px",
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNo,
      sortable: true,
    },
    {
      name: "Order Status",
      selector: (row) => (
        <span
          className={`badge ${
            statusColors[row.orderStatus] || ""
          }-subtle text-uppercase text-dark`}
        >
          {row.orderStatus ? row.orderStatus : "No data available"}
        </span>
      ),
      sortable: true,
    },
    // {
    //   name: "Payment",
    //   selector: (row) => (
    //     <span
    //       className={`badge ${
    //         statusColors1[row.paymentMethod] || ""
    //       }-subtle text-uppercase text-dark`}
    //     >
    //       {row.paymentMethod ? row.paymentMethod : "No data available"}
    //     </span>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Delivery Date",
      selector: (row) => (
        <span>{row.deliveryDate ? row.deliveryDate : "no data available"}</span>
      ),
      sortable: true,
    },
    // {
    //   name: "Total",
    //   selector: (row) =>
    //     row.subTotal ? row.subTotal.toLocaleString() : "No data available",
    //   sortable: true,
    //   right: true,
    // },
  ];

  const data = filteredData.map((item, index) => {
    return {
      index: index + 1,
      orderRef: item.orderRef,
      name: item.customerDetailDto?.name,
      createdDate: item.createdDate,
      address: item.customerDetailDto?.address,
      phoneNo: item.customerDetailDto?.phoneNumber,
      subTotal: item?.subTotal,
      orderStatus: item?.orderStatus,
      paymentMethod: item?.paymentType === 2 ? "Paid" : "Unpaid",
      deliveryDate: item?.deliveryDate,
      id: item.id,
    };
  });

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Delivery list"
            pageTitle="Delivery  "
            // breadcrumbItems={breadcrumbItems}
          />

          <Filter
            requestlogdata={setrequestlogdata}
            setFilters={setFilters}
            fetchrequestlogs={fetchrequestlogs}
            filters={filters}
            loading={loading}
          />
          <Row>
            <div className="d-flex pb-2 gap-1">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Order Ref No., Order Status, Phone No."
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

export default Delivery;
