import React, { useState } from "react";
import FilterComponent from "./FilterComponent";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import { Container } from "reactstrap";
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

const ShipmentTable = ({ manifestDetail }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Event handler for changing the current page
  const handlePageChange = (pageNumber) => {
    setFilters((prev) => {
      return {
        ...prev,
        pageNumber: pageNumber,
      };
    });
    fetchShipmentDetails({ ...filters, pageNumber: pageNumber });
  };
  const data = manifestDetail?.manifestDetails[0]?.shipmentDetails.map(
    (item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    }
  );

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchShipmentDetails({
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
    // {
    //   name: "Created Date",
    //   selector: (row) =>
    //     new Date(row.createdDate).toLocaleDateString("en-US", {
    //       year: "2-digit",
    //       month: "2-digit",
    //       day: "2-digit",
    //     }),
    //   width: "145px",

    //   sortable: true,
    // },
    {
      name: "Ref Number",
      selector: (row) => row.referenceId,
      sortable: true,
      width: "145px",
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
      width: "145px",
    },

    {
      name: "PickUp Address",
      selector: (row) => {
        return (
          <span
            title={`${row?.pickUpSuburb}, ${row?.pickUpState}, ${row?.pickUpPostcode}
           `}
          >
            {row?.pickUpSuburb} {row?.pickUpState} {row?.pickUpPostcode}
          </span>
        );
      },

      sortable: true,
    },
    {
      name: "Delivery Address",
      selector: (row) => (
        <span
          title={`
          ${row?.destinationSuburb}, ${row?.destinationState}, ${row?.destinationPostcode}
         `}
        >
          {row?.destinationSuburb} {row?.destinationState}{" "}
          {row?.destinationPostcode}{" "}
        </span>
      ),
      // grow: 1.5,
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => {
        return (
          <div>
            {/* <span className="cursor-pointer fs-5 me-3">
              <i
                class="bx bxs-pencil text-success"
                onClick={() => {
                  navigate(`/shipmentedit/${row?.id}`, "_blank");
                }}
              ></i>
            </span> */}
            <span
              className="cursor-pointer fs-5"
              onClick={() => {
                navigate(`/shipmentdetail/${row?.id}`, "_blank");
              }}
            >
              {/* <Link to={`/shipmentdetail/${row?.id}`}> */}
              <i className="bx bx-show text-primary" />
              {/* </Link> */}
            </span>
          </div>
        );
      },
      width: "120px",
    },
  ];
  return (
    <Container className="mb-2">
      {/* <FilterComponent /> */}

      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        progressPending={loading}
        customStyles={customStyles}
        onRowClicked={(row) => {
          navigate(`/manifest-description/${row.id}`);
        }}
        // paginationServer
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        paginationTotalRows={50}
        // onChangeRowsPerPage={handlePerRowsChange}
        // onChangePage={handlePageChange}
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
    </Container>
  );
};

export default ShipmentTable;
