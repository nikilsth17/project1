import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import OrderServices from "../../services/DibyaServices/OrderServices/OrderServices";
import { Col, Row, Input, Button, Card } from "reactstrap";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import Details from "./OrderEdit/Detail";

const OrderDetail = () => {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [packageContents, setPackageContents] = useState({});
  const printRef = useRef(null);

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

  useEffect(() => {
    (async () => {
      try {
        const response = await OrderServices.getViewOrder(id);
        setOrderDetail(response);

        // Check for packages and fetch their contents
        if (response?.orderDetails?.some(detail => detail.item.isPackage)) {
          const packagePromises = response.orderDetails.map(detail => {
            if (detail.item.isPackage) {
              return OrderServices.getPackageContents(detail.item.id, id).then(contents => ({
                packageId: detail.item.id,
                contents
              }));
            }
            return null;
          }).filter(Boolean);

          const packageResponses = await Promise.all(packagePromises);
          const packageContentsMap = packageResponses.reduce((acc, packageItem) => {
            acc[packageItem.packageId] = packageItem.contents;
            return acc;
          }, {});
          setPackageContents(packageContentsMap);
        }
      } catch (error) {
        console.log("🚀 ~ error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.sn,
      sortable: true,
      width: "75px",
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`data:image/jpeg;base64, ${row.image}`}
          alt="Image"
          style={{ width: "100px", height: "auto" }}
        />
      ),
      sortable: true,
      hide: "print",
    },
    {
      name: "Item",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category || "No data available",
      sortable: true,
      width: "250px",
    },
    // {
    //   name: "Ingredients",
    //   selector: (row) => row.ingredients || "No data available",
    //   sortable: true,
    //   grow: 2,
    // },
    {
      name: "Price",
      selector: (row) =>
        row.price ? row.price.toLocaleString() : "No data available",
      right: true,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) =>
        row.itemQuantity
          ? row.itemQuantity.toLocaleString()
          : "No data available",
      right: true,
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) =>
        row.price ? row.price.toLocaleString() : "No data available",
      right: true,
      sortable: true,
    },
  ];

  const filteredData = orderDetail?.orderDetails
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.item.name.toLowerCase().includes(searchText) ||
        item.item.ingredients.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: item.id,
      sn: index + 1,
      image: item.item.image,
      name: item.item.name,
      price: item.item.price,
      itemQuantity: item.itemQuantity,
      price: item.price,
      ingredients: item.item.ingredients,
      isPackage: item.item.isPackage,
      category: item.item.category?.title,
      packageId: item.item.packageId,
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const breadcrumbItems = [{ title: "Back To List ", link: "/orders" }];

  return (
    <>
      <div className="print-container">
        <div className="page-content" ref={printRef}>
          <div className="container-fluid">
            <BreadCrumb
              pageTitle="Order"
              title="Order Detail"
              breadcrumbItems={breadcrumbItems}
            />
          </div>

          <Details orderDetail={orderDetail} orderId={id} /> {/* Pass the orderId here */}
          <Row className="d-print-none">
            <h5>Item Details</h5>
            <div className="d-flex pb-2 gap-1 justify-content-between">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Item or Description"
                />
              </Col>
              <button
                type="button"
                className="btn btn-outline-dark d-print-none"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer"></i>
                Print
              </button>
            </div>
          </Row>
          <DataTable
            className="d-print-none"
            responsive
            striped
            pagination={false} // Disable pagination
            fixedHeader
            highlightOnHover
            pointerOnHover
            persistTableHead
            progressPending={loading}
            customStyles={customStyles}
            columns={columns}
            data={filteredData}
          />

          {/* Printable Data Section */}
          <div className="d-none d-print-block mt-4">
            <h1>Item Details:</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th>Item</th>
                  <th>Ingredients</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail?.orderDetails?.map((item, index) => (
                  <>
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.item.name}</td>
                      <td>{item.item.ingredients || "No data available"}</td>
                      <td>
                        {item.item.price
                          ? item.item.price.toLocaleString()
                          : "No data available"}
                      </td>
                      <td>
                        {item.itemQuantity
                          ? item.itemQuantity.toLocaleString()
                          : "No data available"}
                      </td>
                      <td>
                        {item.price
                          ? item.price.toLocaleString()
                          : "No data available"}
                      </td>
                    </tr>
                    {item.item.isPackage && packageContents[item.item.id]?.map((packageItem) => (
                      <tr key={`package-${packageItem.id}`}>
                        <td></td>
                        <td>{packageItem.itemName}</td>
                        <td></td>
                        <td>{packageItem.itemPrice.toLocaleString()}</td>
                        <td>{packageItem.quantity}</td>
                        <td>{packageItem.finalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </>
                ))}
                {/* Total Price Row */}
                <tr>
                  <td colSpan="5" className="fw-bold">Total Price:</td>
                  <td className="fw-bold">
                    {orderDetail?.totalPrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;