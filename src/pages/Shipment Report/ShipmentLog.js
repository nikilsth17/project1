import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import {
  Badge,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { useParams } from "react-router-dom";
import ShipmentLogServices from "../../services/ShipmentLogServices/ShipmentLogServices";

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
      backgroundColor: "#E8F3EA",
    },
  },
  rowHighlight: {
    style: {
      fontSize: "0.9rem", // Change the font size of rows here
      // backgroundColor: "#00FF00", // Green color for the last row
    },
  },
};

const ShipmentLog = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState();
  const [remarks, setRemarks] = useState("");

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const columns = [
    {
      name: "DateTime",
      selector: (row) =>
        new Date(row.createdDate).toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      sortable: true,
      width: "190px",
    },
    {
      name: "User",
      selector: (row) => row.user,
      sortable: true,
      width: "190px",
    },
    {
      name: "Action",
      selector: (row) => {
        if (row.actions === "Create") {
          return "Shipment Create";
        } else if (row.actions === "GetLabel") {
          return "Get Label";
        } else if (row.actions === "Reschedule") {
          return "Reschedule Shipment";
        } else if (row.actions === "Cancel") {
          return "Shipment Cancel";
        }
      },
      sortable: true,
      width: "160px",

      //   grow: 2,
    },

    {
      name: "Result",
      selector: (row) => (
        <h5>
          <Badge color={`${row.isSuccess ? "success" : "danger"} `}>
            {row.isSuccess ? "Success" : "Failed"}
          </Badge>
        </h5>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "Remarks",
      selector: (row) => (
        <span
          className="cursor-pointer text-secondary text-decoration-underline"
          onClick={() => {
            setRemarks(row.remarks);
            toggleModal();
          }}
        >
          {row.remarks}
        </span>
      ),
      sortable: true,
      width: "180px",

      //   grow: 2,
    },
    {
      name: "IP Address",
      selector: (row) => row.ip,
      sortable: true,
      width: "160px",

      //   grow: 2,
    },
    // {
    //   name: "IP and Hostname",
    //   selector: (row) => row.referenceTrackingNumber,
    //   sortable: true,
    // },
  ];

  const fetchShipmentLog = async () => {
    try {
      const response = await ShipmentLogServices.getShipmentLog({
        shipmentId: id,
      });
      setData(response);
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
    }
  };
  useEffect(() => {
    fetchShipmentLog();
  }, []);

  return (
    <div>
      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        paginationPerPage={50}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        //   progressPending={loading}
        customStyles={customStyles}
        //   paginationServer
        //   paginationTotalRows={totalData}
        //   onChangeRowsPerPage={handlePerRowsChange}
        //   onChangePage={handlePageChange}
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
        //   conditionalRowStyles={[
        //     {
        //       when: (row) => row.index === totalData - 1,
        //       style: "rowHighlight",
        //     },
        //   ]}
      />

      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader
          style={{ height: "3rem" }}
          className="border"
          close={
            <h2 className="cursor-pointer" onClick={toggleModal}>
              <i className=" bx bx-x " />
            </h2>
          }
        >
          Shipment Logs Remark
        </ModalHeader>
        <ModalBody>{remarks}</ModalBody>
      </Modal>
    </div>
  );
};

export default ShipmentLog;
