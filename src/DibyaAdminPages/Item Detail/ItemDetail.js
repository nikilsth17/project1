import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
} from "reactstrap";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
import axios from "axios";
import OrderServices from "../../services/DibyaServices/OrderServices/OrderServices";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const ItemDetail = () => {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");

  const toggleModal = (itemId) => {
    console.log("🚀 ~ toggleModal ~ itemId:", itemId);
    setShow(true);
    setSelectedItemId(itemId);
  };
  const toggleModal1 = () => {
    setShow(false);
  };

  const customStyles = {
    headCells: {
      style: {
        fontSize: "0.92rem",
        fontWeight: 610,
      },
    },
    rows: {
      style: {
        fontSize: "0.9rem",
      },
    },
  };

  async function fetchOrderList() {
    try {
      const fetchedItem = await OrderServices.getItemOrderDetail();
      console.log("Fetched Item List:", fetchedItem);
      setItemList(fetchedItem);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Item List:", err);
    }
  }

  const handleDelete = async (itemId) => {
    try {
      if (window.confirm("Do you really want to delete this item?")) {
        const deletedItem = await ItemServices.deleteItem(itemId);
        console.log("Item deleted successfully:", deletedItem);
        setItemList((prevItemList) =>
          prevItemList.filter((item) => item.id !== itemId)
        );
        toast.success("Item Deleted Successfully", { autoClose: 3000 });
      } else {
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.sn,
      sortable: true,
      width: "75px",
    },
    {
      name: "Customer",
      selector: (row) => row.customerName,
      sortable: true,
      // width: "180px",
    },
    {
      name: "Order Reference",
      selector: (row) => row.orderRef,
      sortable: true,
      // width: "250px",
    },
    {
      name: "Item",
      selector: (row) => row.itemName,
      sortable: true,
      // width: "150px",
    },
    {
      name: "Created Date",
      selector: (row) => row.createdDate || "No data available",
      sortable: true,
      // width: "170px",
    },
    {
      name: "Quantity",
      selector: (row) => row.itemQuantity || "No data available",
      sortable: true,
      // width: "150px",
      center: true,
    },

    {
      name: "Final Price",
      selector: (row) =>
        row.price ? row.price.toLocaleString() : "No data available",
      center: true,
      // width: "150px",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => row.action,
      center:true
    },
  ];

  // const data = Array.isArray(itemList)
  // ? itemList.filter((item) => {
  //     const searchText = filterText.toLowerCase();
  //     return (
  //       item.itemName.toLowerCase().includes(searchText) ||
  //       item.customerName.toLowerCase().includes(searchText) ||
  //       item.orderRef.toLowerCase().includes(searchText) ||
  //       (item.customerDetailDto?.name &&
  //         item.customerDetailDto.name.toLowerCase().includes(searchText))
  //     );
  //   })
  // : []
  const data = itemList
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(searchText) ||
        item.customerName.toLowerCase().includes(searchText) ||
        item.orderRef.toLowerCase().includes(searchText) ||
        (item.customerDetailDto?.name &&
          item.customerDetailDto.name.toLowerCase().includes(searchText))
      );
    })
    .map((item, index) => ({
      id: item.id,

      sn: index + 1,

      orderId: item.orderId,
      orderRef: <Link to={`/orders/${item.orderId}`}>{item.orderRef}</Link>,
      itemId: item.itemId,
      customerId: item.customerId,
      customerName: item.customerName,
      itemName: <Link to={`/items/${item.itemId}`}>{item.itemName}</Link>,

      createdDate: item.createdDate,
      itemQuantity: item.itemQuantity,
      price: item.price,

      action: (
        <ButtonGroup size="sm">
          <Link to={`/orders/${item.orderId}`}>
            <Button color="btn btn-soft-success" className="btn-sm gap-1">
              <i className="bx bx-show" />
            </Button>
          </Link>
        </ButtonGroup>
      ),
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb title="Item Details List" pageTitle="Items Details" />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Item Name, Refrence Number, Customer Name"
              />
            </Col>
          </div>
        </Row>

        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          highlightOnHover
          pointerOnHover
          persistTableHead
          progressPending={loading}
          customStyles={customStyles}
          paginationResetDefaultPage={resetPaginationToggle}
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

    </Container>
  );
};

export default ItemDetail;
