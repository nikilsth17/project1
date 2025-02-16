import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { Triangle } from "react-loader-spinner";
import CustomerAust from "../../services/AustServices/Customeraust/CustomerAust";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DraftRecords from "./DraftRecords";
import InvoiceDetails from "./InvoicesDetails";
import Quotes from "./quotes";
import Shipment from "./Shipment";
import CustomerDescription from "./components/CustomerDescription";

const CustomerAUDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({});
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await CustomerAust.viewWithTxn(id);
        setCustomerDetails(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employeeDetail:", error);
        setLoading(false);
      }
    };
    const timeout = setTimeout(() => {
      fetchShipment();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [id]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const breadcrumbItems = [{ title: "Back to List", link: "/CustomerAUS" }];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Customer Detail"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Customer"
        />
        {loading ? (
          <Row className="justify-content-center align-items-center">
            <Col xs={2}>
              <Triangle
                visible={true}
                height="80"
                width="80"
                color="#5B71B9"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <h6 className="mt-2">Loading...</h6>
            </Col>
          </Row>
        ) : (
          <Container fluid>
            <CustomerDescription customerDetails={customerDetails} />
            {/* <Row>
              <Col>
                {customerDetails.length === 0 ? (
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
                ) : (
                  <div className="profile-foreground position-relative mx-n4 mt-n4">
                    <div className="profile-wid-bg"></div>
                  </div>
                )}
                <div className="pt-3 mb-2 mb-lg-3 pb-lg-2">
                  <Row>
                    <Col>
                      <div className="d-flex align-items-start">
                        <div className="ms-0">
                          <div className="p-1">
                            <div className="d-flex align-items-center ms-2">
                              <h5 className="text-white m-0 ">
                                {customerDetails.firstName}{" "}
                                {customerDetails.lastName}
                              </h5>
                            </div>
                            <div className="d-flex align-items-center ms-2 mb-2">
                              {customerDetails.addressLine1 &&
                                customerDetails.city &&
                                customerDetails.state &&
                                customerDetails.postCode &&
                                customerDetails.countryName && (
                                  <div className="d-flex align-items-center">
                                    <p className="text-white m-0 ms-1">
                                      {customerDetails.addressLine1}, <br />
                                      {customerDetails.city},
                                      {customerDetails.state},{" "}
                                      {customerDetails.postCode},{" "}
                                      {customerDetails.countryName}
                                    </p>
                                  </div>
                                )}
                            </div>

                            <div className="d-flex align-items-center ms-2 ">
                              <h5 className="text-white m-0">
                                Company Details
                              </h5>
                            </div>
                            <div>
                              <div className="d-flex align-items-center ms-2 ">
                                {(customerDetails.accountFirstName ||
                                  customerDetails.accountLastName) && (
                                  <div className="d-flex align-items-center">
                                    {customerDetails.accountFirstName && (
                                      <p className="text-white m-0 ms-1w">
                                        {customerDetails.accountFirstName}
                                      </p>
                                    )}
                                    {customerDetails.accountLastName && (
                                      <p className="text-white m-0 ms-2">
                                        {customerDetails.accountLastName}
                                      </p>
                                    )}
                                    <span>
                                      {customerDetails.accountEmailAddress && (
                                        <div className="d-flex align-items-center ml-4  ">
                                          <i className=" text-white p-1 ms-3 "></i>
                                          <p className="text-white m-0 ms-1">
                                            {
                                              customerDetails.accountEmailAddress
                                            }
                                          </p>
                                        </div>
                                      )}
                                    </span>
                                  </div>
                                )}

                                {customerDetails.accountPhoneNumber && (
                                  <div className="d-flex align-items-center ml-4">
                                    <i className=" text-white p-1 ms-3"></i>
                                    <p className="text-white m-0  ms-1">
                                      {customerDetails.accountPhoneNumber}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="d-flex align-items-center ms-2 ">
                                {customerDetails.companyName && (
                                  <div className="d-flex align-items-center">
                                    <p className="text-white m-0 ms-1">
                                      {customerDetails.companyName}
                                    </p>
                                    <span>
                                      {customerDetails.companyAbn && (
                                        <div className="d-flex align-items-center ">
                                          <i className=" text-white p-1 ms-3"></i>
                                          <p className="text-white m-0 ms-1">
                                            {customerDetails.companyAbn}
                                          </p>
                                        </div>
                                      )}
                                    </span>
                                  </div>
                                )}

                                {customerDetails.companyPhoneNumber && (
                                  <div className="d-flex align-items-center ml-4">
                                    <i className=" text-white p-1 ms-3"></i>
                                    <p className="text-white m-0 ms-1">
                                      {customerDetails.companyPhoneNumber}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="d-flex align-items-center ms-2 mt-2">
                              {customerDetails.customerType && (
                                <div className="d-flex align-items-center">
                                  <p className="text-white m-0 ms-1">
                                    Customer Type :{" "}
                                    {customerDetails.customerType.title}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="d-flex align-items-center ms-2">
                              <div className="d-flex align-items-center">
                                <p className="text-white m-0 ms-1">
                                  Customer QuickbookId:{" "}
                                  {customerDetails.quickBookId}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col className="text-end me-4">
                      {customerDetails.quickBookId ? (
                        <h5>
                          <Badge
                            className="cursor-pointer"
                            title={`QuickbookId:${customerDetails.quickBookId}`}
                            color="success"
                          >
                            Verified
                          </Badge>
                        </h5>
                      ) : (
                        <h5>
                          <Badge color="warning">Not Verified</Badge>
                        </h5>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row> */}

            <Row className="py-auto ">
              <Col lg={12}>
                <div className="py-auto ">
                  <div className="d-flex ">
                    <Nav
                      pills
                      className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                      role="tablist"
                    >
                      <NavItem>
                        <NavLink
                          href="#overview-tab"
                          className={classnames({
                            active: activeTab === "1",
                          })}
                          onClick={() => {
                            toggleTab("1");
                          }}
                          title="Draft"
                        >
                          <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                          <span className="d-none d-md-inline-block">
                            Drafts
                          </span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          href="#activities"
                          className={classnames({
                            active: activeTab === "2",
                          })}
                          onClick={() => {
                            toggleTab("2");
                          }}
                          title="Quote"
                        >
                          <i
                            title="Quote"
                            className="ri-save-2-line d-inline-block d-md-none"
                          ></i>{" "}
                          <span className="d-none d-md-inline-block">
                            Quote
                          </span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          href="#projects"
                          className={classnames({
                            active: activeTab === "3",
                          })}
                          onClick={() => {
                            toggleTab("3");
                          }}
                          title="Shipment"
                        >
                          <i
                            title="Shipment"
                            className="ri-ship-line d-inline-block d-md-none"
                          ></i>{" "}
                          <span className="d-none d-md-inline-block">
                            Shipment
                          </span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          href="#summary"
                          className={classnames({
                            active: activeTab === "4",
                          })}
                          onClick={() => {
                            toggleTab("4");
                          }}
                          title="Finance"
                        >
                          <i className="ri-money-dollar-circle-line d-inline-block d-md-none"></i>{" "}
                          <span className="d-none d-md-inline-block">
                            Finance
                          </span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <Card>
                    <CardBody>
                      <TabContent
                        activeTab={activeTab}
                        className="pt-4 text-muted"
                      >
                        <TabPane tabId="1">
                          <DraftRecords
                            customerDetails={customerDetails}
                            loading={loading}
                          />
                        </TabPane>
                        <TabPane tabId="2">
                          <Quotes customerDetails={customerDetails} />
                        </TabPane>
                        <TabPane tabId="3">
                          <Shipment customerDetails={customerDetails} />
                        </TabPane>
                        <TabPane tabId="4">
                          <InvoiceDetails
                            customerDetails={customerDetails}
                            loading={loading}
                          />
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </Container>
  );
};

export default CustomerAUDetail;
