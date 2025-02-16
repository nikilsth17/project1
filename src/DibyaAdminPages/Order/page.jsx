// Orders.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Input, Modal, ModalBody } from "reactstrap";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import OrderServices from "../../services/DibyaServices/OrderServices/OrderServices";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import OrderEdit from "./OrderEdit/OrderEdit";
import { useSelector } from 'react-redux';

import { getLoggedInUser } from "../../helpers/fakebackend_helper";

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

const Orders = () => {
  const [order, setOrder] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      try {
        await OrderServices.delete(id);
        const temp = order.filter((item) => item.id !== id);
        setOrder(temp);
        toast.success("Order Deleted Successfully!");
      } catch (error) {
        console.log("🚀 ~ handleDelete ~ error:", error);
      }
    }
  };

  const [isUsers, setIsUsers] = useState(false);
  const authUser = getLoggedInUser();
  const isAuthenticated = useSelector((state) => state.Auth.isAuthenticated);
  // Ensure authUser is defined and has associatedRoles
  const hasAdminRole = authUser?.user?.roles?.includes("SuperAdmin");
  
  const handleEdit = (id) => {
    setSelectedOrderId(id);
    setModalOpen(true);
  };

  const handleFilter = (event) => {
    setFilterText(event.target.value);
  };

  const statusColors = {
    "Ongoing": "bg-primary",
    "Received": "bg-warning",
    "Processing": "bg-success",
    "Processed": "bg-danger",
    "Delivered": "bg-info",
    "Cancelled": "bg-danger",
  };

  const statusColors1 = {
    "Paid": "bg-primary",
    "Unpaid": "bg-warning",
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Customer",
      selector: (row) => `${row.name}`,
      sortable: true,
      // width: "250px",
    },
    {
      name: "Order Reference",
      cell: (row) => <Link to={`/orders/${row.id}`}>{row.orderRef}</Link>,
      sortable: true,
      // width: "250px",
    },
    {
      name: "Created Date",
      cell: (row) => row.createdDate,
      sortable: true,
      // width: "200px",
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
      // width: "180px",
    },
    {
      name: "Order Status",
      selector: (row) => (
        <span
          className={`badge ${
            statusColors[row.orderStatus] || ""
          }-subtle text-uppercase text-dark`}
        >
          {row.orderStatus ? row.orderStatus : "No data available"}
        </span>
      ),
      sortable: true,
      // width: "150px",
    },
    {
      name: "Total",
      selector: (row) =>
        row.subTotal ? row.subTotal.toLocaleString() : "No data available",
      sortable: true,
      // right: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <span
            title="View Manifest Details"
            className="cursor-pointer fs-5 me-3"
            onClick={() => {
              navigate(`/orders/${row.id}`);
            }}
          >
            <i className="bx bx-show text-success" />
          </span>
          <span
            title="Edit Admin"
            className="cursor-pointer fs-5 me-3"
            onClick={() => {
              handleEdit(row.id);
            }}
          >
            <i className="bx bx-edit-alt text-primary"></i>
          </span>
          {hasAdminRole && (
            <span
              title="Delete Admin"
              className="cursor-pointer fs-5 me-3"
              onClick={() => {
                handleDelete(row.id);
              }}
            >
              <i className="bx bx-trash fs-5 text-danger"></i>
            </span>
          )}
          {/* <span
            title="Delete Admin"
            className="cursor-pointer fs-5 me-3"
            onClick={() => {
              handleDelete(row.id);
            }}
          >
            <i className="bx bx-trash fs-5 text-danger"></i>
          </span> */}
        </div>
      ),
      // width: "140px",
      center: true,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await OrderServices.getOrder();
        setOrder(response);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, []);

  const filteredData = order.filter((item) => {
    const searchText = filterText.toLowerCase();
    return (
      (item.subTotal &&
        item.subTotal.toString().toLowerCase().includes(searchText)) ||
      (item.orderStatus &&
        item.orderStatus.toLowerCase().includes(searchText)) ||
      (item.orderRef &&
        item.orderRef.toLowerCase().includes(searchText)) ||
      (item.customerDetailDto?.name &&
        item.customerDetailDto.name.toLowerCase().includes(searchText))
    );
  });

  const data = filteredData.map((item, index) => ({
    index: index + 1,
    orderRef: item.orderRef,
    name: `${item.customerDetailDto?.name}, ${item.customerDetailDto?.address}`,
    phoneNumber: `${item.customerDetailDto?.phoneNumber}`,
    createdDate: item.createdDate,
    subTotal: item?.subTotal,
    orderStatus: item?.orderStatus,
    paymentMethod: item?.paymentType === 2 ? "Paid" : "Unpaid",
    id: item.id,
  }));

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Order List" pageTitle="Order" />
      </div>
      <Row>
        <div className="d-flex pb-2 gap-1">
          <Col lg={4}>
            <Input
              type="text"
              value={filterText}
              onChange={handleFilter}
              placeholder="Filter by Customer, Refrence Number, Order Status"
            />
          </Col>
        </div>
      </Row>
      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        customStyles={customStyles}
        columns={columns}
        data={data}
      />
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalBody>
          <OrderEdit
            orderId={selectedOrderId}
            onClose={() => setModalOpen(false)}
            setOrder={setOrder}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Orders;