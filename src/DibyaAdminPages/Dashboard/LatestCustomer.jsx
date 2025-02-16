import React, { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainerReactTable";

const LatestCustomer = ({ data }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const userType = user?.user?.user_type;
  // console.log("data",data);
  const paginationTable =
    data?.newCustomers
      ?.map((item) => ({
        id: `${item?.id}`,

        name: `${item.name} ${item.surname}`, // Concatenate name and surname
        address: item.address || "", // Fallback if address is not available
        email: item.email || "", // Fallback email
        phone: item.phone_number || "", // Fallback phone
      }))
      .reverse() || [];

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
        Header: "Address",
        accessor: "address",
        disableFilters: true,
        filterable: false,
        disableSortBy: true,
      },
      {
        Header: "Phone",
        accessor: "phone",
        disableFilters: true,
        filterable: false,
        disableSortBy: true,
        Cell: ({ row }) => {
          let phoneNumber = row.original.phone; // Get phone number from the row data

          if (/^[1-9]\d{8}$/.test(phoneNumber)) {
            return `0${phoneNumber}`; // If it's 9 digits (not starting with 0), add a leading 0
          } else if (/^0\d{9}$/.test(phoneNumber)) {
            return phoneNumber; // If it's already valid (10 digits starting with 0), return as is
          } else {
            return ""; // If it doesn't match either format, show an error message
          }
        },
      },
      {
        Header: "Email",
        accessor: "email",
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
        columns={columns || []}
        data={paginationTable || []}
        isPagination={true}
        // isGlobalFilter={false}

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
export default LatestCustomer;
