import React from "react";
import DataTable from "react-data-table-component";
import { Row } from "reactstrap";

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

const ShipmentCancelLog = ({ shipmentCancelLog }) => {
  const data = shipmentCancelLog?.map((item, index) => {
    return {
      ...item,
      index: index + 1,
    };
  });
  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },

    {
      name: "Tracking Number",
      selector: (row) => row.trackingNumber,
      sortable: true,
    },
    {
      name: "Refernce ID",
      selector: (row) => <span title={row.refrenceId}>{row.refrenceId}</span>,
      sortable: true,
    },

    {
      name: "Reason",
      selector: (row) => row.reason,

      sortable: true,
    },
    {
      name: "Shipment Id",
      selector: (row) => row?.shipmentId,
      // grow: 1.5,
      sortable: true,
      width: "140px",
    },
    {
      name: "International Service Provider",
      selector: (row) => row?.internationalServiceProvider,
      // grow: 1.5,
      sortable: true,
    },
  ];
  return (
    <Row>
      {" "}
      <h5 className="text-secondary">
        International Shipment Cancellation Log
      </h5>
      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        // progressPending={loading}
        customStyles={customStyles}
        // selectableRowSelected={(row) => console.log(row.selected)}

        // paginationPerPage={50}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        paginationTotalRows={shipmentCancelLog?.length}
        // progressComponent={
        //   <div className="my-3">
        //     <Triangle
        //       visible={true}
        //       height="80"
        //       width="80"
        //       color="#5B71B9"
        //       ariaLabel="triangle-loading"
        //       wrapperStyle={{}}
        //       wrapperClass=""
        //     />
        //     <h5 className="mt-1">Loading...</h5>
        //   </div>
        // }
        columns={columns}
        data={data}
      />
    </Row>
  );
};

export default ShipmentCancelLog;
