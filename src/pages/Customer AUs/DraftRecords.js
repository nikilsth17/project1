import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Button, Col, Input, Row } from "reactstrap";
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

const DraftRecords = ({ customerDetails, loading }) => {
  console.log("🚀 ~ DraftRecords ~ customerDetails:", customerDetails.drafts);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "75px" },
    {
      name: "Pick-Up",
      selector: (row) => (
        <>
          <div>{row.pickUpCompanyName}</div>
          <div>{`${row.pickUpSuburb}, ${row.pickUpState}, ${row.pickUpPostcode}`}</div>
        </>
      ),
      grow: 2,
    },
    {
      name: "Destination",
      selector: (row) => (
        <>
          <div>{row.destinationCompanyName}</div>
          <div>{`${row.destinationSuburb}, ${row.destinationState}, ${row.destinationPostcode}`}</div>
        </>
      ),
      sortable: true,
      grow: 2,
    },
    {
      name: "Service Provider",
      selector: (row) => row.serviceProviderName,
      sortable: true,
      grow: 2,
    },
    {
      name: "Total",
      selector: (row) => <span>${row.total}</span>,
      sortable: true,
    },
  ];

  const data = customerDetails?.drafts
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
      id: index + 1,
      pickUpCompanyName: item.pickUpCompanyName || "No data available",
      pickUpEmail: item.pickUpEmail || "No data available",
      pickUpSuburb: item.pickUpSuburb || "No data available",
      pickUpState: item.pickUpState || "No data available",
      pickUpPostcode: item.pickUpPostcode || "No data available",
      pickUpPhone: item.pickUpPhone || "No data available",
      destinationCompanyName:
        item.destinationCompanyName || "No data available",
      destinationSuburb: item.destinationSuburb || "No data available",
      destinationState: item.destinationState || "No data available",
      destinationPostcode: item.destinationPostcode || "No data available",
      total: item.total || "No data available",
      serviceProviderName: item.intlShipment
        ? `${item.intlServiceProviderName} ${item.domesticServiceProviderName}`
        : item.domesticServiceProviderName || "No data available",
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  // const handleClearFilter = () => {
  //   setFilterText("");
  // };

  return (
    <>
      <Row>
        <div className="d-flex pb-2 gap-1">
          <Col lg={5}>
            <Input
              type="text"
              value={filterText}
              onChange={handleFilter}
              placeholder="Search by Pickup or Destination Address or Service Provider"
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
        paginationPerPage={50}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        paginationResetDefaultPage={resetPaginationToggle}
        progressPending={loading}
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

export default DraftRecords;
