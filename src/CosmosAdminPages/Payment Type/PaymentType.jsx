// import React,{useState,useEffect} from 'react'
// import BreadCrumb from '../../Components/Common/BreadCrumb'
// import CustomDataTable from '../../Components/CustomTable/CustomTable'
// import { Button, ButtonGroup } from 'reactstrap';
// import { Link } from 'react-router-dom';
// import { Triangle } from 'react-loader-spinner';
// import PaymenttypeService from '../../services/PackageType Service/PackagetypeService';
// import EditModal from './Component/EditModal';

// const PaymentType = () => {
//     const [loading, setLoading] = useState(false);
//     const [paymentTypeList, setPaymentTypeList] = useState([]);
//     const [modal, setModal] = useState(false); // Modal state
//     const [editingPackage, setEditingPackage] = useState(null); // To track editing mode or new package
//     const [newPackage, setNewPackage] = useState({ title: '', gst_percent: '', service_fee_percent: '' }); // Initial package state

//     const toggleModal = () => setModal(!modal); // Toggle modal visibility

//     const handleEdit = (row) => {
//       setEditingPackage(row); // Set the package to edit
//       setNewPackage({ title: row.title, gst_percent: row.gst_percent, service_fee_percent: row.service_fee_percent });
//       toggleModal(); // Open modal for editing
//     };

//     const handleSave = () => {
//       // Logic to save the edited package or add new one
//       if (editingPackage) {
//         // Update existing package logic here
//       } else {
//         // Add new package logic here
//       }
//       toggleModal(); // Close modal after save
//     };

//     async function fetchPaymentType() {
//       setLoading(true);
//       try {
//         const response = await PaymenttypeService.getList();
//         setPaymentTypeList(response.data); // Adjusted to set the data from the correct structure
//       } catch (error) {
//         console.error("Error fetching payment types:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     useEffect(() => {
//       fetchPaymentType();
//     }, []);

//     const columns = [
//       {
//         name: "S.N",
//         selector: (row, index) => index + 1,
//         sortable: true,
//       },
//       {
//         name: "Title",
//         selector: (row) => <Link to={`/payment-type/detail/${row?.id}`}>{row?.title}</Link>,
//         sortable: true,
//       },
//       {
//         name: "GST (%)",
//         selector: (row) => `${row?.gst_percent || 0}`,
//         sortable: true,
//         right:true,

//       },
//       {
//         name: "Service Fee (%)",
//         selector: (row) => `${row?.service_fee_percent || 0}`,
//         sortable: true,
//         right:true,

//       },
//       {
//         name: "Service Fee Amount",
//         selector: (row) => `${row?.service_fee_amount || 0}`,
//         sortable: true,
//         right:true,
//       },
//       {
//         name: "Actions",
//         cell: (row) => (
//           <ButtonGroup className="gap-3">
//             <Button color="warning" className="rounded-circle btn-sm" onClick={() => handleEdit(row)}>
//               <i className="bx bx-edit"></i>
//             </Button>
//           </ButtonGroup>
//         ),
//         center:true,
//       },
//     ];

//     return (
//       <div className="page-content">
//         <div className="container-fluid">
//           <BreadCrumb title="Payment Type" pageTitle="Payment Type" />
//         </div>

//         <CustomDataTable
//           responsive
//           striped
//           pagination
//           fixedHeader
//           persistTableHead
//           progressPending={loading}
//           columns={columns}
//           data={paymentTypeList}
//           customStyles={{
//             headCells: {
//               style: {
//                 fontSize: "0.93rem",
//                 fontWeight: 610,
//               },
//             },
//             rows: {
//               style: {
//                 fontSize: "0.9rem",
//               },
//             },
//           }}
//           progressComponent={
//             <div className="my-3">
//               <Triangle visible={true} height="80" width="80" color="#5B71B9" ariaLabel="triangle-loading" />
//               <h5 className="mt-1">Loading...</h5>
//             </div>
//           }
//         />

//         <EditModal
//           modal={modal}
//           toggleModal={toggleModal}
//           editingPackage={editingPackage}
//           newPackage={newPackage}
//           setNewPackage={setNewPackage}
//           handleSave={handleSave}
//         />
//       </div>
//     );
//   };

//   export default PaymentType;

import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CustomDataTable from "../../Components/CustomTable/CustomTable";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import PaymenttypeService from "../../services/PackageType Service/PackagetypeService";
import EditModal from "./Component/EditModal";
import useIsSmallScreen from "./Component/small screen/SmallScreen";

const PaymentType = () => {
  const [loading, setLoading] = useState(false);
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [modal, setModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [newPackage, setNewPackage] = useState({
    title: "",
    gst_percent: "",
    service_fee_percent: "",
  });
  const isSmallScreen = useIsSmallScreen();

  const toggleModal = () => setModal(!modal);

  const handleEdit = (row) => {
    setEditingPackage(row);
    setNewPackage({
      title: row.title,
      gst_percent: row.gst_percent,
      service_fee_percent: row.service_fee_percent,
    });
    toggleModal();
  };

  const fetchPaymentType = async () => {
    setLoading(true);
    try {
      const response = await PaymenttypeService.getList();
      setPaymentTypeList(response.data);
    } catch (error) {
      console.error("Error fetching payment types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentType();
  }, []);

  const savePackage = (updatedPackage) => {
    setPaymentTypeList((prevList) =>
      prevList.map((pkg) =>
        pkg.id === editingPackage.id ? { ...pkg, ...updatedPackage } : pkg
      )
    );
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) =>
        // <Link to={`/payment-type/detail/${row?.id}`}>{row?.title}</Link>
        row?.title,
      sortable: true,
    },
    {
      name: "GST (%)",
      selector: (row) => `${row?.gst_percent || 0}`,
      sortable: true,
      right: true,
    },
    {
      name: "Surcharge (%)",
      selector: (row) => `${row?.service_fee_percent || 0}`,
      sortable: true,
      right: true,
    },
    {
      name: "Surcharge Amount",
      selector: (row) => `${row?.service_fee_amount || 0}`,
      sortable: true,
      right: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <ButtonGroup className="gap-3">
          <Button
            color="warning"
            className="rounded-circle btn-sm"
            onClick={() => handleEdit(row)}
          >
            <i className="bx bx-edit"></i>
          </Button>
        </ButtonGroup>
      ),
      center: true,
    },
  ];
  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Payment Type" pageTitle="Payment Type" />
      </div>

      {/* Conditionally render the table or cards based on screen size */}
      {isSmallScreen ? (
        loading ? (
          <div className="d-flex justify-content-center my-3">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#5B71B9"
              ariaLabel="triangle-loading"
            />
          </div>
        ) : (
          <Row>
            {paymentTypeList.map((item, index) => (
              <Col md={12} key={index} className="mb-1 smallScreen">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">{item.title}</CardTitle>
                    <CardText>
                      <strong>GST:</strong> {item.gst_percent}%
                    </CardText>
                    <CardText>
                      <strong>Service Fee:</strong> {item.service_fee_percent}%
                    </CardText>
                    <CardText>
                      <strong>Service Fee Amount:</strong>{" "}
                      {item.service_fee_amount}
                    </CardText>
                    <div className="text-end">
                      <Button
                        color="warning"
                        className="rounded-circle btn-sm"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="bx bx-edit"></i>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        )
      ) : (
        <CustomDataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          progressPending={loading}
          columns={columns}
          data={paymentTypeList}
          customStyles={{
            headCells: {
              style: {
                fontSize: "0.93rem",
                fontWeight: 610,
              },
            },
            rows: {
              style: {
                fontSize: "0.9rem",
              },
            },
          }}
          progressComponent={
            <div className="my-3">
              <Triangle
                visible={true}
                height="80"
                width="80"
                color="#5B71B9"
                ariaLabel="triangle-loading"
              />
              <h5 className="mt-1">Loading...</h5>
            </div>
          }
        />
      )}

      <EditModal
        modal={modal}
        toggleModal={toggleModal}
        editingPackage={editingPackage}
        savePackage={savePackage} // Pass savePackage to EditModal
        newPackage={newPackage} // Pass newPackage to EditModal
        setNewPackage={setNewPackage} // Pass setNewPackage to EditModal
      />
    </div>
  );
};

export default PaymentType;
