import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Badge, Button, Col, Input, Row, Table } from "reactstrap";

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

const InvoiceDetails = ({ customerDetails, loading }) => {
  console.log(
    "🚀 ~ InvoiceDetails ~ customerDetails:",
    customerDetails.invoices
  );
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const columns = [
    {
      name: "S.N",
      selector: (row) => row.id,
      sortable: true,
      width: "75px",
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
    // {
    //   name: "Invoice Date",
    //   selector: (row) => row.invoiceDate,
    //   sortable: true,
    //   // grow: 2,
    // },
    {
      name: "Due Date",
      selector: (row) => row.dueDate,
      sortable: true,
      // grow: 2,
    },
    // {
    //   name: "Overdue",
    //   selector: (row) => row.overdue,
    //   sortable: true,
    // },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      right: true,
    },
    {
      name: "Payment",
      selector: (row) => row.payment,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row.action,
    },
  ];

  const data = customerDetails.invoices
    ?.filter((customerDetail) => {
      const searchText = filterText.toLowerCase();
      return (
        (customerDetail &&
          customerDetail.refNo &&
          customerDetail.refNo.toLowerCase().includes(searchText)) ||
        (customerDetail.from &&
          customerDetail.from.locality.toLowerCase().includes(searchText)) ||
        (customerDetail.to.state &&
          customerDetail.to.state.toLowerCase().includes(searchText)) ||
        (customerDetail.from.state &&
          customerDetail.from.state.toLowerCase().includes(searchText)) ||
        (customerDetail.from.postalCode &&
          customerDetail.from.postalCode.toLowerCase().includes(searchText)) ||
        (customerDetail.to.postalCode &&
          customerDetail.to.postalCode.toLowerCase().includes(searchText)) ||
        (customerDetail.toCompanyName &&
          customerDetail.toCompanyName.toLowerCase().includes(searchText)) ||
        (customerDetail.fromCompanyName &&
          customerDetail.fromCompanyName.toLowerCase().includes(searchText))
      );
    })
    .map((item, index) => {
      return {
        id: index + 1,
        invoice: item.refNo,
        pickUp: `${item.from.locality},${item.from.postalCode},${item.from.state}`,
        delivery: `${item.to.locality},${item.to.postalCode},${item.to.state}`,
        invoiceDate: new Date(item.invoiceDate).toLocaleDateString("en-US", {
          // weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
        dueDate: new Date(item.dueDate).toLocaleDateString("en-US", {
          // weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
        overdue: item.overDue,
        amount: `$${item.totalAmount}`,
        payment: (
          <Badge
            color={`${item.isPaid ? "success" : "warning"}`}
            className="text-uppercase px-1"
          >
            {item.isPaid ? "Paid" : "WithStanding"}
          </Badge>
        ),
        action: (
          <Link to={`/invoice-report/detail/${item.id}`} target="_blank">
            View Details
            {/* <h5>
              <i className="ri-eye-fill align-middle"></i>
            </h5> */}
          </Link>
        ),
      };
    });

  // /invoice-report/detail/630

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
          <Col lg={6}>
            <Input
              type="text"
              value={filterText}
              onChange={handleFilter}
              placeholder="Search by  Pickup Address/Company or Delivery Address/Company"
            />
          </Col>
        </div>
      </Row>
      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        customStyles={customStyles}
        persistTableHead
        paginationPerPage={50}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        paginationResetDefaultPage={resetPaginationToggle}
        progressPending={loading}
        highlightOnHover
        pointerOnHover
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

export default InvoiceDetails;
