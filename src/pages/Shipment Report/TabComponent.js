import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import ShipmentDeleteModal from "./ShipmentDeleteModal";

const TabComponent = ({ shipment, fetchShipment }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("domestic");
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const toggleModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  return (
    <div className="">
      <Nav tabs justified>
        <NavItem>
          <NavLink
            className={`${
              activeTab === "domestic" && "cursor-pointer text-light "
            } cursor-pointer`}
            onClick={() => toggleTab("domestic")}
            style={{
              fontSize: "15px",
              background: `${activeTab === "domestic" ? "#67B173" : "#FBFBF3"}`,
            }}
          >
            Domestic
          </NavLink>
        </NavItem>
        {shipment.intlShipment && (
          <NavItem>
            <NavLink
              className={`${
                activeTab === "international" && "cursor-pointer  text-light "
              } cursor-pointer`}
              onClick={() => toggleTab("international")}
              style={{
                fontSize: "15px",
                background: `${
                  activeTab === "international" ? "#67B173" : "#FBFBF3"
                }`,
              }}
            >
              International
            </NavLink>
          </NavItem>
        )}
      </Nav>
      <Row>
        <Col md={12}>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="domestic">
              <Card>
                <CardBody className="p-4">
                  <Row className="g-3">
                    <Col lg={3} className="col-6 pb-2 pb-2">
                      <p className=" mb-2 text-uppercase fw-semibold fs-13">
                        Tracking Number
                      </p>
                      <p className="fs-13 mb-0">
                        {shipment.domesticShipment?.trackingRefernceNumber || (
                          <span className="fst-italic">
                            No tracking number{" "}
                          </span>
                        )}
                      </p>
                    </Col>
                    <Col lg={3} className="col-6 pb-2 pb-2">
                      <p className=" mb-2 text-uppercase fw-semibold fs-13">
                        Created Date
                      </p>
                      <p className="fs-13 mb-0">
                        {new Date(
                          shipment.domesticShipment?.addedDateUTC
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }) || (
                          <span className="fst-italic">No created date </span>
                        )}
                      </p>
                    </Col>

                    <Col lg={3} className="col-6 pb-2 pb-2">
                      <p className=" mb-2 text-uppercase fw-semibold fs-13">
                        Service Provider
                      </p>
                      <h5 className="fs-13 mb-0">
                        {shipment.domesticShipment?.serviceProvider || (
                          <span className="fst-italic">
                            No service provider{" "}
                          </span>
                        )}
                      </h5>
                    </Col>

                    <Col lg={3} className="col-6 pb-2 pb-2">
                      <p className=" mb-2 text-uppercase fw-semibold fs-13">
                        Shipment Status
                      </p>
                      <h5 className="fs-13 mb-0">
                        {shipment.domesticShipment?.shipmentStatus || (
                          <span className="fst-italic">
                            No Shipment Status{" "}
                          </span>
                        )}
                      </h5>
                    </Col>

                    <Col lg={3} className="col-6 ">
                      <p className=" mb-0 text-uppercase fw-semibold fs-13">
                        From Address
                      </p>
                      {shipment.domesticShipment ? (
                        <Row>
                          <span>
                            {shipment.domesticShipment?.from.locality},
                            {shipment.domesticShipment?.from.state},
                            {shipment.domesticShipment?.from.postCode}
                          </span>
                          <p>{shipment.domesticShipment?.from.addressLine1}</p>
                        </Row>
                      ) : (
                        <span className="fst-italic">No address </span>
                      )}
                    </Col>

                    <Col lg={3} className="col-6 pb-2 pb-2">
                      <p className=" mb-0 text-uppercase fw-semibold fs-13">
                        To Address
                      </p>
                      {shipment.domesticShipment ? (
                        <Row>
                          <span>
                            {shipment.domesticShipment?.to.locality},
                            {shipment.domesticShipment?.to.state},
                            {shipment.domesticShipment?.to.postCode}
                          </span>
                          <p>{shipment.domesticShipment?.to.addressLine1}</p>
                        </Row>
                      ) : (
                        <span className="fst-italic">No address </span>
                      )}
                    </Col>
                    <Col lg={3} className="col-6 pb-2 pb-2">
                      {shipment.domesticShipment?.shipmentStatus ===
                        "Canceled" && (
                        <Badge color="danger" className="fs-6">
                          Canceled
                        </Badge>
                      )}
                    </Col>
                    {/* <Col className="text-end">
                      {shipment.domesticShipment?.shipmentStatus !==
                        "Canceled" && (
                        <Button
                          outline
                          color="danger"
                          onClick={toggleModal}
                          className="me-2"
                        >
                          Cancel Shipment
                        </Button>
                      )}
                      <Button
                        outline
                        color="success"
                        onClick={() => {
                          window.open(`/customer-docs-viewer/${id}`, "_blank");
                        }}
                      >
                        Get Customer Label
                      </Button>
                    </Col> */}
                  </Row>
                  {/* <Row></Row> */}
                </CardBody>
              </Card>
            </TabPane>
          </TabContent>
          {shipment.intlServiceProvider !== 0 && (
            <TabContent activeTab={activeTab}>
              <TabPane tabId="international">
                <Card>
                  <CardBody className="p-4">
                    <Row className="g-3">
                      <Col lg={3} className="col-6 pb-2 pb-2">
                        <p className=" mb-2 text-uppercase fw-semibold fs-13">
                          Tracking Number
                        </p>
                        <p className="fs-13 mb-0">
                          {shipment.intlShipment?.trackingRefernceNumber}
                        </p>
                      </Col>

                      <Col lg={3} className="col-6 pb-2 pb-2">
                        <p className=" mb-2 text-uppercase fw-semibold fs-13">
                          Created Date
                        </p>
                        <p className="fs-13 mb-0">
                          {new Date(
                            shipment.intlShipment?.addedDateUTC
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }) || (
                            <span className="fst-italic">
                              No reference number{" "}
                            </span>
                          )}
                        </p>
                      </Col>

                      <Col lg={3} className="col-6 pb-2 pb-2">
                        <p className=" mb-2 text-uppercase fw-semibold fs-13">
                          Service Provider
                        </p>
                        <h5 className="fs-13 mb-0">
                          {shipment.intlShipment?.serviceProvider}
                        </h5>
                      </Col>

                      <Col lg={3} className="col-6 pb-2 pb-2">
                        <p className=" mb-2 text-uppercase fw-semibold fs-13">
                          Shipment Status
                        </p>
                        <h5 className="fs-13 mb-0">
                          {
                            // <Badge color={`danger`}>
                            shipment.intlShipment?.shipmentStatus || (
                              // </Badge>
                              <span className="fst-italic">
                                No Shipment Status{" "}
                              </span>
                            )
                          }
                        </h5>
                      </Col>

                      <Col lg={3} className="">
                        <p className=" mb-0 text-uppercase fw-semibold fs-13">
                          From Address
                        </p>
                        <Row>
                          <span>
                            {shipment.intlShipment?.from.locality},
                            {shipment.intlShipment?.from.state},
                            {shipment.intlShipment?.from.postCode}
                          </span>
                          <p>{shipment.intlShipment?.from.addressLine1}</p>
                        </Row>
                        {/* <span>
                          {shipment.intlShipment?.from.locality},
                          {shipment.intlShipment?.from.state},
                          {shipment.intlShipment?.from.postCode}
                        </span> */}
                      </Col>

                      <Col lg={3} className="col-6">
                        <p className=" mb-0 text-uppercase fw-semibold fs-13">
                          To Address
                        </p>
                        <Row>
                          <span>
                            {shipment.intlShipment?.to.locality},
                            {shipment.intlShipment?.to.state},
                            {shipment.intlShipment?.to.postCode}
                          </span>
                          <p>{shipment.intlShipment?.to.addressLine1}</p>
                        </Row>
                      </Col>
                      {/* <Col className="text-end">
                        <Button
                          outline
                          color="success"
                          onClick={() => {
                            window.open(`/admin-docs-viewer/${id}`, "_blank");
                          }}
                          className="ms-2"
                        >
                          Get Admin Label
                        </Button>
                      </Col> */}
                    </Row>
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>
          )}
        </Col>
      </Row>
      {/* 
      <ShipmentDeleteModal
        isOpen={deleteModalOpen}
        toggleModal={toggleModal}
        shipmentId={id}
        fetchShipment={fetchShipment}
      /> */}

      {/* <Row className="mt-3">
            <Col md={12}></Col>
        </Row> */}
    </div>
  );
};

export default TabComponent;
