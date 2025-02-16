import { Link } from "feather-icons-react/build/IconComponents";
import React, { useEffect, useState } from "react";
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

const getLocalDate = ({ dateString }) => {
  let temp = dateString;

  let utcDate = new Date(temp);
  const timeZoneOffset = utcDate.getTimezoneOffset();
  const localDateTime = new Date(
    utcDate.getTime() - timeZoneOffset * 60 * 1000
  );

  return localDateTime;
};

const ShipmentTable = ({
  shipment,
  totalData,
  filters,
  setFilters,
  loading,
  fetchShipmentDetails,
  selectedShipment,
  setSelectedShipment,
  activeTab,
}) => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState();

  // Function to handle selected rows change and update the external state
  const handleSelectedRowsChange = (selectedRowsData) => {
    setSelectedRows(selectedRowsData);
    // You can now use selectedRowsData wherever you need it in your application
  };

  useEffect(() => {
    setSelectedShipment(selectedRows);
  }, [selectedRows]);

  // Event handler for changing the current page
  const handlePageChange = (pageNumber) => {
    setFilters((prev) => {
      return {
        ...prev,
        pageNumber: pageNumber,
      };
    });
    fetchShipmentDetails({ filters: { ...filters, pageNumber: pageNumber } });
  };
  const data = shipment.map((item, index) => {
    return {
      ...item,
      index: index + 1,
    };
  });

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchShipmentDetails({
      filters: {
        ...filters,
        pageNumber: page,
        pageSize: newPerPage,
      },
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
      name: "Tracking Number",
      selector: (row) => row.trackingReferenceNumber,
      sortable: true,
      width: "150px",
    },
    {
      name: "Created Date",
      selector: (row) => {
        let i = getLocalDate({
          dateString: new Date(row.createdDate).toLocaleDateString(),
        });

        return new Date(i).toLocaleDateString("en-AU", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        });
      },

      sortable: true,
      // width: "150px",
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
      // width: "145px",
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
      width: "205px",

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
      width: "205px",

      // grow: 1.5,
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => {
        return (
          <div>
            <span className="cursor-pointer fs-5 me-3">
              {/* <Link to={`/shipmentedit/${row?.id}`}> */}
              <i
                class="bx bxs-pencil text-success"
                onClick={() => {
                  navigate(`/shipmentedit/${row?.id}`, "_blank");
                }}
              ></i>
              {/* </Link> */}
            </span>
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
        selectableRows={activeTab !== "all"}
        selectableRowsHighlight
        // selectableRowSelected={(row) => console.log(row.selected)}
        onSelectedRowsChange={(row) =>
          handleSelectedRowsChange(row.selectedRows)
        }
        // paginationPerPage={50}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        paginationTotalRows={totalData}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        searchable
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

export default ShipmentTable;
