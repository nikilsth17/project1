import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
} from "reactstrap";
import TablePagination from "../Pages/Starter/Pagination";

const ShipmentCard = ({
  shipment,
  totalData,
  fetchShipmentDetails,
  filters,
  setFilters,
  selectedShipment,
  setSelectedShipment,
  activeTab,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setFilters((prev) => {
      return {
        ...prev,
        pageNumber: pageNumber,
      };
    });
    fetchShipmentDetails({ filters: { ...filters, pageNumber: pageNumber } });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems({
      ...checkedItems,
      [name]: checked,
    });

    if (checked) {
      const selectedItem = shipment.find((item) => item.id === parseInt(name));
      setSelectedShipment((prevSelectedItems) => [
        ...prevSelectedItems,
        selectedItem,
      ]);
    } else {
      setSelectedShipment((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.id !== parseInt(name))
      );
    }
    // setSelectedShipment(selectedItems);
  };

  return (
    <>
      {shipment?.length > 0 && (
        <Row>
          {shipment.map((shipmentItem, index) => (
            <Col key={index} xs={12} md={12} lg={6}>
              <Card style={{ minHeight: "10.5rem" }}>
                <CardHeader style={{ height: "3rem", backgroundColor: "" }}>
                  <Row>
                    <Col lg={9} md={9} xs={10}>
                      <h7 className="text-primary">
                        Tracking No:{" "}
                        {shipmentItem?.trackingReferenceNumber || (
                          <span className="fst-italic">
                            No reference number
                          </span>
                        )}
                        <span className="text-primary fs-6 fwt-italic ms-2">
                          {"("}
                          {shipmentItem.customerName}
                          {")"}
                        </span>
                      </h7>
                    </Col>

                    <Col className="text-end">
                      {/* <span
                        className="cursor-pointer me-3 fs-5"
                        onClick={() => {
                          shipmentId.current = shipmentItem?.id;
                          toggleModal();
                        }}
                      >
                        <i className="bx bx-trash text-white" />
                      </span> */}
                      {activeTab !== "all" && (
                        <Input
                          type="checkbox"
                          name={shipmentItem.id.toString()}
                          checked={checkedItems[shipmentItem.id] || false}
                          onChange={handleCheckboxChange}
                          className="me-2"
                        />
                      )}
                      <span className="cursor-pointer fs-5 me-2">
                        <Link to={`/shipmentedit/${shipmentItem?.id}`}>
                          <i class="bx bxs-pencil text-secondary"></i>
                        </Link>
                      </span>
                      <span className="cursor-pointer fs-5">
                        <Link to={`/shipmentdetail/${shipmentItem?.id}`}>
                          <i className="bx bx-show text-secondary" />
                        </Link>
                      </span>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row className="pb-2">
                    <Col lg={6}>
                      <div className="d-flex gap-3">
                        <h6>
                          <i className="bx bxs-city text-secondary" /> Service
                          Provider:
                        </h6>
                        <h6 className="text-muted">
                          {shipmentItem?.serviceProvider?.name}
                        </h6>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="d-flex gap-3">
                        <h6>
                          <i className="bx bxs-city text-secondary" /> Total
                          Weight:
                        </h6>
                        <h6 className="text-muted">
                          {shipmentItem?.totalWeight}
                        </h6>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <h6>
                        <i className="bx bxs-home text-secondary" /> PickUp
                        Address:
                      </h6>
                      <h6 className="text-muted">
                        {shipmentItem?.pickUpAddress1}{" "}
                        {shipmentItem?.pickUpSuburb} {shipmentItem?.pickUpState}{" "}
                        {shipmentItem?.pickUpPostcode}
                      </h6>
                    </Col>
                    <Col lg={6}>
                      <h6>
                        <i className="bx bxs-home text-secondary" /> Delivery
                        Address:
                      </h6>
                      <h6 className="text-muted">
                        {shipmentItem?.destinationAddress1}{" "}
                        {shipmentItem?.destinationSuburb}{" "}
                        {shipmentItem?.destinationState}{" "}
                        {shipmentItem?.destinationPostcode}{" "}
                      </h6>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {shipment.length === 0 && (
        <Row className="justify-content-center align-items-center">
          <p className="p-2 pt-5 justify-content-center align-item-center">
            <Col xs={12} className="text-center">
              <img
                src="blankdata.png"
                alt="No data available"
                style={{ width: "400", height: "300px" }}
              />
            </Col>
          </p>
        </Row>
      )}

      <TablePagination
        pagesCount={Math.ceil(totalData / filters.pageSize)}
        currentPage={filters.pageNumber}
        handlePreviousClick={() => handlePageChange(currentPage - 1)}
        handleNextClick={() => handlePageChange(currentPage + 1)}
        handlePageClick={handlePageChange}
      />
    </>
  );
};

export default ShipmentCard;
