import { Link } from "feather-icons-react/build/IconComponents";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { Badge } from "reactstrap";

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

const InvoiceTable = ({
  invoice,
  totalData,
  filters,
  setFilters,
  loading,
  fetchinvoiceDetails,
}) => {
  const navigate = useNavigate();

  // Event handler for changing the current page
  const handlePageChange = (pageNumber) => {
    setFilters((prev) => {
      return {
        ...prev,
        pageNumber: pageNumber,
      };
    });
    fetchinvoiceDetails({ ...filters, pageNumber: pageNumber });
  };
  const data = invoice.map((item, index) => {
    return {
      ...item,
      index: index + 1,
    };
  });

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchinvoiceDetails({
      ...filters,
      pageNumber: page,
      pageSize: newPerPage,
    });
    setFilters((prev) => {
      return {
        ...prev,
        pageSize: newPerPage,
      };
    });
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Ref Number",
      selector: (row) => row.refNo,
      sortable: true,
    },
    {
      name: "Invoice Date",
      selector: (row) =>
        new Date(row.invoiceDate).toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        }),
      sortable: true,
    },

    {
      name: "Due Date",
      selector: (row) =>
        new Date(row.dueDate).toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        }),
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => <span>${row.totalAmount}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.isPaid ? (
          <Badge color="success">Paid</Badge>
        ) : (
          <Badge color="warning">Withstanding</Badge>
        ),
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => (
        <span
          className="cursor-pointer text-primary"
          onClick={() => {
            navigate(`/invoice-report/detail/${row.id}`);
          }}
        >
          View Details
        </span>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        progressPending={loading}
        customStyles={customStyles}
        paginationServer
        paginationPerPage={50}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        paginationTotalRows={totalData}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
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
  );
};

export default InvoiceTable;
