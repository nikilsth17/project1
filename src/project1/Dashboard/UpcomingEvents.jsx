import React, { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainerReactTable";
import { formatDateTime } from "../../Components/Common/FormatDate";

const UpcomingEvents = ({ data }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const userType = user?.user?.user_type;

  data?.upcomming?.map((item) => {
    const appointmentId = item.appointment?.customer?.id;
  });

  // const paginationTable =
  //   data?.upcomming?.map((item, index) => ({
  //     name: `${item.appointment?.customer?.name} ${item.appointment?.customer?.surname}`, // Concatenate name and surname
  //     id: `${item?.appointment?.customer?.id}`,
  //     startTime: `${formatDateTime(item.start_time)}` || "", // Concatenate name and surname
  //     endTime: `${formatDateTime(item.end_time)}` || "", // Fallback if address is not available
  //     pickUpAddress: item?.appointment?.pickup_location,
  //     driver: `${item?.appointment?.driver?.user?.name} ${item?.appointment?.driver?.user?.surname}`,
  //   })) || [];

  const paginationTable = useMemo(() => {
    // Convert events to table format and add raw dates for sorting
    const events =
      data?.upcomming?.map((item) => ({
        name: `${item.appointment?.customer?.name} ${item.appointment?.customer?.surname}`,
        id: `${item?.appointment?.customer?.id}`,
        startTime: `${formatDateTime(item.start_time)}` || "",
        endTime: `${formatDateTime(item.end_time)}` || "",
        raw_start_time: new Date(item.start_time), // Add raw date for sorting
        raw_end_time: new Date(item.end_time),
        pickUpAddress: item?.appointment?.pickup_location,
        driver:
          item?.appointment?.driver?.user?.name &&
          item?.appointment?.driver?.user?.surname
            ? `${item?.appointment?.driver?.user?.name} ${item?.appointment?.driver?.user?.surname}`
            : "N/A",
      })) || [];

    // Sort events by start time in ascending order (oldest first)
    return events.sort((a, b) => a.raw_start_time - b.raw_start_time);
  }, [data]);

  const columns = useMemo(
    () => [
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
      },

      {
        Header: "Start Time",
        accessor: "startTime",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "End Time",
        accessor: "endTime",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Pick up Address",
        accessor: "pickUpAddress",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Instructor",
        accessor: "driver",
        disableFilters: true,
        filterable: false,
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
        columns={columns || []}
        data={paginationTable || []}
        isPagination={true}
        isGlobalFilter={false}
        iscustomPageSize={false}
        isBordered={false}
        customPageSize={15}
        className="custom-header-css table align-middle table-nowrap"
        tableClassName="table-centered align-middle table-nowrap mb-0"
        theadClassName="text-muted table-light"
        SearchPlaceholder="Search Products..."
      />
    </React.Fragment>
  );
};
export default UpcomingEvents;
