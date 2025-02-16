import React, { useEffect, useState } from "react";
import { Row, Col, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { useParams, Link } from "react-router-dom";
import { Button } from "reactstrap"; // Import Button from reactstrap
import OrderServices from "../services/DibyaServices/OrderServices/OrderServices";

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

const OrderPending = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderServices.getGuestDetail(id);
        setOrders(response.orders);
        console.log("🚀 ~ fetchOrders ~ response.orders:", response.orders);

        setFilteredOrders(response.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [id]);

  useEffect(() => {
    const filtered = orders.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        (item.itemCount &&
          item.itemCount.toString().toLowerCase().includes(searchText)) ||
        (item.orderRef &&
          item.orderRef.toString().toLowerCase().includes(searchText)) ||
        (item.subTotal &&
          item.subTotal.toString().toLowerCase().includes(searchText))
      );
    });
    setFilteredOrders(filtered);
  }, [filterText, orders]);

  const columns = [
    {
      name: "S.N",
      selector: (_, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: "Order Reference",
      cell: (row) => <Link to={`/orders/${row.id}`}>{row.orderRef}</Link>,
      sortable: true,
      width: "200px",
    },
    {
      name: "Item Count",
      selector: (row) => row.itemCount,
      sortable: true,
    },
    {
      name: "Sub Total",
      selector: (row) => row.subTotal,
      sortable: true,
    },
    {
      name: "IP Address",
      selector: (row) => row.ipAddress || "No data available",
      sortable: true,
    },
    {
      name: "Order Status",
      selector: (row) => row.orderStatus,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/orders/${row.id}`}>
          <i className="bx bx-show text-success" />
        </Link>
      ),
    },
  ];

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <span className="fw-bold fs-5">Orders</span>
        </Col>
      </Row>
      <Row className="pb-2 gap-1">
        <Col lg={4}>
          <Input
            type="text"
            value={filterText}
            onChange={handleFilter}
            placeholder="Filter by Item Name, Price"
          />
        </Col>
      </Row>
      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        columns={columns}
        data={filteredOrders}
        customStyles={customStyles}
      />
    </div>
  );
};

export default OrderPending;
