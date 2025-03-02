import React, { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { formatDateTime } from "../../Components/Common/FormatDate";

const NewBookingList = ({ data }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const userType = user?.user?.user_type;

  // console.log("data",data);
  // const paginationTable =
  //   data?.newBookings?.map((item, index) => ({
  //     name: `${item.customer?.name} ${item.customer?.surname}`, // Concatenate name and surname
  //     id: `${item?.customer?.id}`,
  //     booking_date: `${formatDateTime(item.booking_date)}` || "", // Concatenate name and surname
  //     pickUpAddress: item?.pickup_location,
  //     driver: `${item?.driver?.user?.name} ${item?.driver?.user?.surname}`,
  //   })) || [];

  const paginationTable = useMemo(() => {
    // Convert bookings to table format and add raw date for sorting
    const bookings =
      data?.newBookings?.map((item) => ({
        name: `${item.customer?.name} ${item.customer?.surname}`,
        id: `${item?.customer?.id}`,
        booking_date: `${formatDateTime(item.booking_date)}` || "",
        raw_date: new Date(item.booking_date), // Add raw date for sorting
        pickUpAddress: item?.pickup_location,
        driver:
          item?.driver?.user?.name && item?.driver?.user?.surname
            ? `${item.driver.user.name} ${item.driver.user.surname}`
            : "N/A",
      })) || [];

    // Sort bookings by date in ascending order (oldest first)
    return bookings.sort((a, b) => a.raw_date - b.raw_date);
  }, [data]);

  const columns = useMemo(
    () => [
      // {
      //   Header: "ID",
      //   accessor: "id",
      //   disableFilters: true,
      //   filterable: false,
      //   // Ensure sorting is enabled for this column
      //   disableSortBy: false,
      // },
      {
        Header: "Name",
        accessor: (cellProps) => {
          return userType === "DRIVER" ? (
            <Link to={`/customer/detail/${cellProps.id}`} className="fw-medium">
              {cellProps.name}
            </Link>
          ) : (
            <Link to={`/customer/detail/${cellProps.id}`} className="fw-medium">
              {cellProps.name}
            </Link>
          );
        },
        disableFilters: true,
        filterable: false,
        disableSortBy: true,
      },

      {
        Header: "Booked Date",
        accessor: "booking_date",
        disableFilters: true,
        filterable: false,
        disableSortBy: true,
      },
      {
        Header: "PickUp Address",
        accessor: "pickUpAddress",
        disableFilters: true,
        filterable: false,
        disableSortBy: true,
      },
      {
        Header: "Instructor",
        accessor: "driver",
        disableFilters: true,
        filterable: false,
        disableSortBy: true,
      },
      // {
      //   Header: "Status",
      //   disableFilters: true,
      //   filterable: true,
      //   accessor: (cellProps) => {
      //     switch (cellProps.status) {
      //       case "Paid":
      //         return (<span className="badge bg-success-subtle text-success text-uppercase"> {cellProps.status}</span>)
      //       case "Refund":
      //         return (<span className="badge bg-warning-subtle text-warning text-uppercase"> {cellProps.status}</span>)
      //       default:
      //         return (<span className="badge bg-danger-subtle text-danger text-uppercase"> {cellProps.status}</span>)
      //     }
      //   },
      // },
      // {
      //   Header: "Actions",
      //   disableFilters: true,
      //   filterable: true,
      //   accessor: (cellProps) => {
      //     return (
      //       <React.Fragment>
      //         Details
      //       </React.Fragment>
      //     );
      //   },
      // },
    ],
    []
  );

  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={paginationTable}
        isPagination={true}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={15}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder="Search Products..."
        defaultSorted={[{ id: "booking_date", asc: true }]} // Example: set descending order on 'booking_date'
      />
    </React.Fragment>
  );
};
export default NewBookingList;
