import React, { useEffect, useState } from "react";
import { Row, Col, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { useParams, Link } from "react-router-dom";
import ItemServices from "../../services/DibyaServices/ItemServices/ItemServices";

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

const ItemDetail = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ItemServices.List(id);
        setOrders(response);
        setFilteredOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [id]);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const searchText = filterText.toLowerCase();
      return (
        order.refId.toLowerCase().includes(searchText) ||
        order.quantity.toString().includes(searchText) ||
        order.finalPrice.toString().includes(searchText)
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
      name: "Item",
      selector: (row) => row.item.name,
      sortable: true,
    },
    {
      name: "Order Reference",
      cell: (row) => row.refId,
      sortable: true,
      width: "200px",
    },
    {
      name: "Created Date",
      cell: (row) => row.createdDate,
      sortable: true,
      width: "200px",
    },
    {
      name: "Price",
      selector: (row) => row.price?.toLocaleString(),
      sortable: true,
      right: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      right: true,
    },
    {
      name: "Sub Total",
      selector: (row) => row.finalPrice?.toLocaleString(),
      sortable: true,
      right: true,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <Link to={`/orders/${row.id}`}>
    //       <i className="bx bx-show text-success" />
    //     </Link>
    //   ),
    // },
  ];

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <span className="fw-bold fs-5">Item Detail</span>
        </Col>
      </Row>
      <Row className="pb-2 gap-1">
        <Col lg={4}>
          <Input
            type="text"
            value={filterText}
            onChange={handleFilter}
            placeholder="Filter by Order Reference, Quantity, or Sub Total"
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

export default ItemDetail;
