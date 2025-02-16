import React, { useState, useEffect } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  Row,
  Col,
  Container,
} from "reactstrap";
import LayoutForCRUDListingPage from "../Pages/Starter/LayoutForCRUDListingPage";
import Addresstype from "./Addresstype";
import ItemType from "./ItemType";
import Countries from "./Countries";
import HearabServices from "./HearabServices";
import SerProvider from "./SerProvider";
import InternationalSP from "./InternationalSP";
import DomesticSP from "./DomesticSP";
import PaymentT from "./PaymentT";
import ShipmentStatus from "./ShipmentStatus";
import PrinterOption from "./PrinterOption";
import PaperWorkNL from "./PaperWorkNL";
import NotificationR from "./NotificationR";
import { Triangle } from "react-loader-spinner";
import LayoutWithBreadCrumb from "../Pages/Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const GeneralReports = () => {
  const [activeTab, setActiveTab] = useState("vouchers");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Address Type");
  const [loading, setLoading] = useState(true);

  const toggleTab = (tab, item) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setSelectedItem(item);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);

  return (
    <React.Fragment>
      <Container fluid>
        <div className="page-content">
          <BreadCrumb
            title="Pre-defined Data List"
            pageTitle="Pre-defined Data "
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
            <Row className="d-flex justify-content-start">
              <Col lg={2}></Col>
              <Col lg={8}>
                <Card>
                  <div className="card-header d-flex justify-content-between">
                    <div>{selectedItem}</div>
                    <div className="d-flex justify-content-end">
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle
                          caret
                          className="mr-0 "
                          style={{ width: "200px", height: "40px" }}
                        >
                          Select the dropdown
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() => toggleTab("vouchers", "Address Type")}
                          >
                            Address Type
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => toggleTab("income", "Item Type")}
                          >
                            Item Type
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => toggleTab("expenses", "Countries")}
                          >
                            Countries
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              toggleTab("Hearabsc", "Hear About Source")
                            }
                          >
                            Hear About Source
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              toggleTab("ServiceP", "Service Provider")
                            }
                          >
                            Service Provider
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              toggleTab(
                                "IServiceP",
                                "InterNational Service Provider"
                              )
                            }
                          >
                            InterNational Service Provider
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              toggleTab("DServiceP", "Domestic Service Provider")
                            }
                          >
                            Domestic Service Provider
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              toggleTab("Shipment", "Shipment Status")
                            }
                          >
                            Shipment Status
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => toggleTab("Printer", "Printer Option")}
                          >
                            Printer Option
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              toggleTab(
                                "Paperwork",
                                "Paperwork Notification List"
                              )
                            }
                          >
                            Paperwork Notification List
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              toggleTab("NotiR", "Notification Receiver")
                            }
                          >
                            Notification Receiver
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="vouchers">
                      <Addresstype />
                    </TabPane>
                    <TabPane tabId="income">
                      <ItemType />
                    </TabPane>
                    <TabPane tabId="expenses">
                      <Countries />
                    </TabPane>
                    <TabPane tabId="Hearabsc">
                      <HearabServices />
                    </TabPane>
                    <TabPane tabId="ServiceP">
                      <SerProvider />
                    </TabPane>
                    <TabPane tabId="IServiceP">
                      <InternationalSP />
                    </TabPane>
                    <TabPane tabId="DServiceP">
                      <DomesticSP />
                    </TabPane>
                    <TabPane tabId="Payment">
                      <PaymentT />
                    </TabPane>
                    <TabPane tabId="Shipment">
                      <ShipmentStatus />
                    </TabPane>
                    <TabPane tabId="Printer">
                      <PrinterOption />
                    </TabPane>
                    <TabPane tabId="Paperwork">
                      <PaperWorkNL />
                    </TabPane>
                    <TabPane tabId="NotiR">
                      <NotificationR />
                    </TabPane>
                  </TabContent>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
};

export default GeneralReports;
