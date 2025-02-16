
import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import NumberWithCommas from "../Pages/Starter/NumberWithCommas";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import ConfigureSetingServices from "../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import { Col, Container, Row,Card,CardBody } from "reactstrap";


const Customershipmentdetail = () => {
  const { id: shipmentId } = useParams();
  const location  = useLocation();
  const queryParms = new URLSearchParams(location.search);
  const customerId = queryParms.get('customerId');
  const [shipment, setShipment] = useState({});
  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await ConfigureSetingServices.getshipment( shipmentId);
        console.log("Shipment:", response);
        setShipment(response);
      } catch (error) {
        console.error("Error fetching shipment:", error);
      }
    };

    fetchShipment();
  }, []);

  

  const breadcrumbItems = [
    { title: ' < Customer Details', link: `/CustomerAUS/details/${customerId}` },
  ];

  
    return (
        <React.Fragment>
            <div className="page-content">
              <Container fluid>
                <BreadCrumb title="Shipment Details"   breadcrumbItems={breadcrumbItems} />
                <Row>
        {/* <h4>Booking Details</h4> */}
       <Col lg={6}>
          <Card className="p-4 border-top">
            <h4 style={{ borderBottom: "1px solid #000" }}>PICKUP DETAILS</h4>
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.pickUpFirstName} {shipment.pickUpLastName}
            </p>
            
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.pickUpCompanyName}
            </p>
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.pickUpEmail}
            </p>
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.pickUpAddress1}, {shipment.pickUpAddress2}, {shipment.pickUpState}, {shipment.pickUpPostcode}
            </p>
            
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.pickUpSuburb}
            </p>
           
           
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.pickUpPhone}
            </p>
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.pickUpInstruction}
            </p>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="p-4 border-top ">
            <h4 style={{ borderBottom: "1px solid #000" }}>DELIVERY DETAILS</h4>
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.destinationFirstName} {shipment.destinationLastName}
            </p>
            
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.destinationCompanyName}
            </p>
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.destinationEmail}
            </p>
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.destinationAddress1},{shipment.destinationAddress2}, {shipment.destinationState},  {shipment.destinationPostcode}
            </p>
           
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.destinationSuburb}
            </p>
           
         <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.destinationPhone}
            </p>
            <p className="text-muted mb-1" id="billing-address-line-1">
              {shipment.specialInstruction}
            </p>
          </Card>
        </Col>
      </Row>
      {/* <Row>
        <Col lg={12}>
          <h4>SERVICE DETAILS</h4>
          <Card>
            <CardBody className="p-4">
              <Row className="g-3">
                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Carrier Name
                  </p>
                  <h5 className="fs-15 mb-0">
                    {shipment.serviceProvider && (
                      <span id="invoice-no">
                        {shipment.serviceProvider.name}
                      </span>
                    )}
                  </h5>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Tracking Number
                  </p>
                  <h5 className="fs-15 mb-0">
                    <span id="invoice-date">{shipment.shipmentId}</span>{" "}
                  </h5>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Reference ID
                  </p>
                  <span id="payment-status">{shipment.referenceId}</span>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Customer Reference
                  </p>
                  <h5 className="fs-15 mb-0">
                    <span id="total-amount">Russel Hussaini</span>
                  </h5>
                </Col>
              </Row>

              <div className="mt-2"></div>
              <Row className="g-3">
                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Description
                  </p>
                  <h5 className="fs-15 mb-0">
                    <span id="invoice-no">{shipment.descriptionOfGoods}</span>
                  </h5>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Booking Date
                  </p>
                  <h5 className="fs-15 mb-0">
                    <span id="invoice-date">{shipment.collectionDate}</span>{" "}
                  </h5>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Warranty
                  </p>
                  <span id="payment-status">$250</span>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Price
                  </p>
                  <h5 className="fs-15 mb-0">
                    <span id="total-amount">{shipment.price}</span>
                  </h5>
                </Col>
              </Row>

              <div className="mt-2"></div>
              <Row className="g-3">
                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Dangerous Goods
                  </p>
                  <h5 className="fs-15 mb-0">
                    <span id="invoice-no">No</span>
                  </h5>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Shipment Type
                  </p>
                  <h5 className="fs-15 mb-0">
                    <span id="invoice-date">
                      {shipment.serviceTypeDescription}
                    </span>{" "}
                  </h5>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Estimated Pickup
                  </p>
                  <span id="payment-status">{shipment.fromTime}</span>
                </Col>

                <Col lg={3} className="col-6">
                  <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                    Estimated Delivery
                  </p>
                  <h5 className="fs-15 mb-0">
                    <span id="total-amount">{shipment.toTime}</span>
                  </h5>
                </Col>
              </Row> */}
            {/* </CardBody>
          </Card>
        </Col>
      </Row> */}


              </Container>
    
    </div>
          </React.Fragment>
  );
};

export default Customershipmentdetail;
