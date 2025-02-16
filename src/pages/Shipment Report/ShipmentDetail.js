import React, { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";

import { useParams } from "react-router-dom";

import ShipmentService from "../../services/AustServices/Shipmentservice";
import TabComponent from "./TabComponent";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CommercialDetails from "./CommercialDetails";
import ShipmentLog from "./ShipmentLog";
import ShipmentDeleteModal from "./ShipmentDeleteModal";
import PriceBreakDown from "./components/PriceBreakDown";
import BookedPackageDetails from "./components/BookedPackageDetails";
import ButtonComponent from "./components/ButtonComponent";
import ShipmentCancelLog from "./components/ShipmentCancelLog";

const ShipmentDetail = () => {
  const { id } = useParams();

  function sumSimilarKeys(obj1, obj2) {
    const result = {};

    for (const key in obj1) {
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        result[key] = obj1[key] + obj2[key];
      }
    }

    return result;
  }

  console.log(id);
  const [shipment, setShipment] = useState({});

  const calculateVolume = (item) => {
    const volume =
      shipment._unit === 1
        ? ((item.height * item.length * item.width) / 1000000).toFixed(3)
        : ((item.height * item.length * item.width) / 1728).toFixed(3);

    return volume;
  };
  const hasPriceBreakdowns =
    shipment.shipmentPriceBreakdowns &&
    shipment.shipmentPriceBreakdowns.length > 0;

  const fetchShipment = async () => {
    try {
      const response = await ShipmentService.getList(id);
      console.log("Shipment:", response);
      setShipment(response);
    } catch (error) {
      console.error("Error fetching shipment:", error);
    }
  };
  useEffect(() => {
    fetchShipment();
  }, []);

  const breadcrumbItems = [
    { title: "Back to shipments list", link: "/shipment-report" },
  ];

  const result = sumSimilarKeys(
    shipment.internationalPriceBreaks,
    shipment.domesticPriceDetail
  );

  return (
    <div className="page-content">
      <Container>
        <BreadCrumb
          title="Shipment Detail Page"
          pageTitle="Shipment Report"
          breadcrumbItems={breadcrumbItems}
        />
      </Container>
      <Container>
        <ButtonComponent
          shipment={shipment}
          id={id}
          fetchShipment={fetchShipment}
        />
        <Row className="mt-3">
          <TabComponent shipment={shipment} fetchShipment={fetchShipment} />
        </Row>
        <Row className="pt-4">
          <h5 style={{ color: "#556AAE" }}>Booking Details</h5>
          <Col lg={6}>
            <Card>
              <h5
                style={{
                  // borderBottom: "1px solid #000",
                  backgroundColor: "#556AAE",
                  color: "white",
                  padding: "10px",
                }}
              >
                Pickup Details
              </h5>
              <Row>
                <Col lg={6}>
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.pickUpFirstName} {shipment.pickUpLastName}
                  </p>

                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.pickUpCompanyName}
                  </p>
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.pickUpEmail}
                  </p>

                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.pickUpAddress1}
                  </p>
                </Col>

                <Col lg={6} className="">
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.pickUpSuburb} {shipment.pickUpState}{" "}
                    {shipment.pickUpPostcode}
                  </p>

                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.pickUpPhone}
                  </p>
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.pickUpInstruction}
                  </p>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <h5
                style={{
                  // borderBottom: "1px solid #000",
                  backgroundColor: "#556AAE",
                  color: "white",
                  padding: "10px",
                }}
              >
                Delivery Details
              </h5>
              <Row>
                <Col lg={6}>
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.destinationFirstName}{" "}
                    {shipment.destinationLastName}
                  </p>

                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.destinationCompanyName}
                  </p>
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.destinationEmail}
                  </p>
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.destinationAddress1}
                  </p>
                </Col>
                <Col lg={6}>
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.destinationSuburb} {shipment.destinationState}{" "}
                    {shipment.destinationPostcode}
                  </p>

                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.destinationPhone}
                  </p>
                  <p className=" mb-1 px-2" id="billing-address-line-1">
                    {shipment.destinationInstruction}
                  </p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {shipment?.cancelledShipmentLogs &&
          shipment?.cancelledShipmentLogs.length > 0 && (
            <Row>
              <ShipmentCancelLog
                shipmentCancelLog={shipment?.cancelledShipmentLogs}
              />
            </Row>
          )}

        <Row>
          <Col lg={12}>
            <h5 style={{ color: "#556AAE" }}>Service Details</h5>
            <Card>
              <CardBody className="p-4">
                <Row className="g-3">
                  <Col lg={3} className="col-6 pb-2 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Carrier Name
                    </p>
                    <h5 className="fs-13 mb-0">
                      {shipment.serviceProvider && (
                        <span id="invoice-no">
                          {shipment.serviceProvider.name}
                        </span>
                      )}
                    </h5>
                  </Col>

                  <Col lg={3} className="col-6 pb-2 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Tracking Number
                    </p>
                    <h5 className="fs-13 mb-0">
                      {shipment.shipmentId ? (
                        <span>{shipment.shipmentId}</span>
                      ) : (
                        <span className="font-italic text-muted">
                          No data available
                        </span>
                      )}
                    </h5>
                  </Col>

                  <Col lg={3} className="col-6 pb-2 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Reference ID
                    </p>
                    {shipment.referenceId ? (
                      <span>{shipment.referenceId}</span>
                    ) : (
                      <span className="font-italic text-muted">
                        No data available
                      </span>
                    )}
                  </Col>

                  <Col lg={3} className="col-6 pb-2 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Customer Reference
                    </p>
                    <h5 className="fs-13 mb-0">
                      <span id="total-amount">{shipment.customerName}</span>
                    </h5>
                  </Col>

                  <Col lg={3} className="col-6 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Description
                    </p>
                    <h5 className="fs-15 mb-0">
                      {shipment.descriptionOfGoods ? (
                        <span>{shipment.descriptionOfGoods}</span>
                      ) : (
                        <span className="font-italic text-muted">
                          No data available
                        </span>
                      )}
                    </h5>
                  </Col>

                  <Col lg={3} className="col-6 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Booking Date
                    </p>
                    <h5 className="fs-13 mb-0">
                      {shipment.createdDate ? (
                        <>
                          <span className="mr-2">
                            {new Date(shipment.createdDate).toLocaleString(
                              "en-US"
                              // {
                              //   year: "numeric",
                              //   month: "short",
                              //   day: "numeric",
                              // }
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="font-italic text-muted">
                          No data available
                        </span>
                      )}
                    </h5>
                  </Col>

                  {/* <Col lg={3} className="col-6 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Warranty
                    </p>
                    <span id="payment-status">$250</span>
                  </Col> */}

                  <Col lg={3} className="col-6 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Price
                    </p>
                    <h5 className="fs-13 mb-0">
                      {shipment.price ? (
                        <span>{shipment.price}</span>
                      ) : (
                        <span className="font-italic text-muted">
                          No data available
                        </span>
                      )}
                    </h5>
                  </Col>

                  <div className="mt-2"></div>
                  {/* <Col lg={3} className="col-6 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Dangerous Goods
                    </p>
                    <h5 className="fs-15 mb-0">
                      <span id="invoice-no">No</span>
                    </h5>
                  </Col> */}

                  <Col lg={3} className="col-6 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Shipment Type
                    </p>
                    <h5 className="fs-15 mb-0">
                      {shipment.price ? (
                        <span>{shipment.serviceTypeDescription}</span>
                      ) : (
                        <span className="font-italic text-muted">
                          No data available
                        </span>
                      )}
                    </h5>
                  </Col>

                  <Col lg={3} className="col-6 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Estimated Pickup
                    </p>
                    {shipment.pickUpDateTime ? (
                      <>
                        <span className="mr-2">
                          {new Date(shipment.pickUpDateTime).toLocaleString(
                            "en-US"
                            // {
                            //   year: "numeric",
                            //   month: "short",
                            //   day: "numeric",
                            // }
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="font-italic text-muted">
                        No pickup date and time available
                      </span>
                    )}
                  </Col>

                  <Col lg={3} className="col-6 pb-2">
                    <p className=" mb-2 text-uppercase fw-semibold fs-13">
                      Estimated Delivery
                    </p>
                    <h5 className="fs-13 mb-0">
                      {shipment.toTime ? (
                        <span id="total-amount">{shipment.toTime}</span>
                      ) : (
                        <span className="font-italic text-muted">
                          No delivery time available
                        </span>
                      )}
                    </h5>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {shipment.intlShipment && <CommercialDetails shipment={shipment} />}
        <BookedPackageDetails
          shipment={shipment}
          calculateVolume={calculateVolume}
        />
        <Row>
          {hasPriceBreakdowns && (
            <PriceBreakDown shipment={shipment} result={result} />
          )}
        </Row>
        <Row>
          <h5 style={{ color: "#556AAE" }}>Shipment Log</h5>
          <ShipmentLog />
        </Row>
      </Container>
    </div>
  );
};

export default ShipmentDetail;
