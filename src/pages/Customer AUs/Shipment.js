import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Col, Input, Row, Table } from "reactstrap";
import { FormatDate } from "../../Components/Common/FormatDate";
// import FormatDate from "../../Components/Common/FormatDate";
const customStyles = {
  headCells: {
    style: {
      fontSize: "0.92rem", // Change the font size here
      fontWeight: 610, // Optionally change other styles
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem", // Change the font size of rows here
      // You can also optionally add other row styles here
    },
  },
};

const Shipment = ({ customerDetails, loading }) => {
  const [filterText, setFilterText] = useState("");

  console.log("🚀 ~ Shipment ~ customerDetails:", customerDetails.shipments);
  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "90px",
    },
    {
      name: "Carrier",
      selector: (row) => row.carrier,
      sortable: true,
    },
    {
      name: "OWC/CarrierId",
      selector: (row) => row.OWC,
      sortable: true,
    },
    {
      name: "PickUp",
      selector: (row) => row.pickUp,
      sortable: true,
      grow: 2,
    },
    {
      name: "Delivery",
      selector: (row) => row.delivery,
      sortable: true,
      grow: 2,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];

  const data = customerDetails.shipments
    ?.filter((customerDetail) => {
      const searchText = filterText.toLowerCase();
      return (
        (customerDetail &&
          customerDetail.domesticServiceProviderName &&
          customerDetail.domesticServiceProviderName
            .toLowerCase()
            .includes(searchText)) ||
        (customerDetail &&
          customerDetail.intlServiceProvider &&
          customerDetail.intlServiceProviderName
            .toLowerCase()
            .includes(searchText)) ||
        (customerDetail &&
          customerDetail.referenceId &&
          customerDetail.referenceId.toLowerCase().includes(searchText)) ||
        (customerDetail.destinationAddress1 &&
          customerDetail.destinationAddress1
            .toLowerCase()
            .includes(searchText)) ||
        (customerDetail.pickUpAddress1 &&
          customerDetail.pickUpAddress1.toLowerCase().includes(searchText)) ||
        (customerDetail.destinationState &&
          customerDetail.destinationState.toLowerCase().includes(searchText)) ||
        (customerDetail.pickUpSuburb &&
          customerDetail.pickUpSuburb.toLowerCase().includes(searchText)) ||
        (customerDetail.pickUpState &&
          customerDetail.pickUpState.toLowerCase().includes(searchText)) ||
        (customerDetail.pickUpPostcode &&
          customerDetail.pickUpPostcode.toLowerCase().includes(searchText)) ||
        (customerDetail.destinationPostcode &&
          customerDetail.destinationPostcode.toLowerCase().includes(searchText))
      );
    })
    .map((item, index) => ({
      index: index + 1,
      id: item.id,
      carrier: item.intlServiceProvider
        ? item.intlServiceProviderName
        : item.domesticServiceProviderName,
      OWC: item.referenceId ? item.referenceId : "No data available",
      pickUp: (
        <Row>
          <span className="text-uppercase">
            {`${item.pickUpSuburb},${item.pickUpPostcode},${item.pickUpState}`}
          </span>
          <br />
          <span className="text-muted">
            <FormatDate date={item.pickUpDateTime} />
          </span>
        </Row>
      ),
      delivery: (
        <Row>
          <span className="text-uppercase">
            {`${item.destinationSuburb},${item.destinationPostcode},${item.destinationState}`}
          </span>
          <br />
          <span className="text-muted">
            <FormatDate date={item.collectionDate} />
          </span>
        </Row>
      ),

      status: (
        <Row className="my-2">
          <Col className="text-center">
            <span className="fs-10 text-muted text-center">
              {item.shipmentStatus && item.shipmentStatus.name
                ? item.shipmentStatus.name
                : "Status Not Available"}
            </span>
            <br />
            {/* /shipmentdetail/2208 */}
            <Link to={`/shipmentdetail/${item.id}`} target="_blank">
              View Order
            </Link>
          </Col>
        </Row>
      ),
    }));
  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <>
      <Row>
        <div className="d-flex pb-2 gap-1">
          <Col lg={5}>
            <Input
              type="text"
              value={filterText}
              onChange={handleFilter}
              placeholder="Search by Carrier, Pickup or Delivery Address or CarrierId"
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
        progressPending={loading}
        highlightOnHover
        pointerOnHover
        paginationPerPage={50}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        customStyles={customStyles}
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
    </>
  );
};

export default Shipment;
