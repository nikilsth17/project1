import React, { useEffect, useState } from "react";
import { Row, Col, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { Button } from "reactstrap"; // Import Button from reactstrap
import CustomDataTable from "../../../Components/CustomTable/CustomTable";
import { Triangle } from "react-loader-spinner";

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

const OrderTable = ({ bookingDetail }) => {
  const [bookings, setBookings] = useState();
  console.log(bookings, "ORDERS")
  console.log(bookingDetail, "BOOKING DETAIL")

  useEffect(() => {
    setBookings(bookingDetail);
  }, [bookingDetail]);

  const statusColors = {
    Ongoing: "bg-primary",
    Received: "bg-warning",
    Processing: "bg-success",
    Processed: "bg-danger",
    Delivered: "bg-info",
    Cancelled: "bg-danger",
  };


  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: "Customer Name",
      selector: (row) => (
        <Link to={`/appointment/detail/${row.id}`}>
          {row.customer?.name} {row.customer?.surname}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Pickup Address",
      selector: (row) => row.pickup_location || "Not Available",
      sortable: true,
    },
    {
      name: "Payment Proccessors",
      selector: (row) => row.payment_type.title || "Not Available",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.sessions[0].start_time || "Not Available",
      sortable: true,
    },
    {
      name: "Payment Status",
      cell: (row) => (
        <span
          className={`badge ${statusColors[row.payment_status] || "bg-secondary"
            } text-uppercase text-white`}
        >
          {row.payment_status || "No data available"}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => row.appointment_status,
      sortable: true,
    },
  ]


  return (
    <div>
      <CustomDataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        customStyles={customStyles}
        progressComponent={
          <div className="my-3">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#5B71B9"
              ariaLabel="triangle-loading"
            />
          </div>
        }
        columns={columns}
        data={bookings}
        selectableRows
      />
    </div>
  );
};

export default OrderTable;
