import React, { createContext, useEffect, useState } from "react";
import Detail from "../../CosmosAdminPages/Customer/Component/Detail";
import OrderTable from "./components/OrderTable";
import CustomerServices from "../../services/DibyaServices/CustomerServices/Customer.services";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import ItemDetail from "./ItemDetail";
import ItemServices from "../../services/DibyaServices/ItemServices/ItemServices";
import {
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
import classNames from "classnames";
import OrderServices from "../../services/DibyaServices/OrderServices/OrderServices";
import AppointmentService from "../../services/AppointmentServices/AppointmentService";

export const CustomerContext = createContext();

const CustomerDetail = () => {
  const { id } = useParams();
  console.log(id, "IDDDDDD")

  const [customerDetail, setCustomerDetail] = useState();
  const [bookingDetail, setBookingDetail] = useState();
  const [orderDetail, setOrderDetail] = useState([]);
  const [activeTab, setActiveTab] = useState("1"); // Set the initial active tab to "1"

  async function fetchCustomerDetail() {
    try {
      console.log("Hello")
      const response = await CustomerServices.getCustomerDetail(id);
      console.log(response, "RESPNSEEEE")
      setCustomerDetail(response);
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  }

  async function bookings() {
    try {
      console.log("Hello")
      const response = await AppointmentService.detail(id);
      console.log(response.data, "Booking details")
      setBookingDetail(response.data)
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  }

  useEffect(() => {
    fetchCustomerDetail();
    bookings()
  }, [id]);

  const breadcrumbItems = [{ title: "Back To List ", link: "/customers" }];

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await OrderServices.getViewOrder(id);
        console.log("🚀 ~ response:", response.orderDetails);
        setOrderDetail(response);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, []);

  return (
    <div className="page-content">
      <CustomerContext.Provider value={customerDetail}>
        <div class="container-fluid">
          <BreadCrumb
            pageTitle="Customer"
            title="Customer Detail"
            breadcrumbItems={breadcrumbItems}
          />
        </div>

        <Detail customerDetail={customerDetail} />
        <Row className="py-auto">
          <Col lg={12}>
            <div className="py-auto">
              <div className="d-flex">
                {/* <Nav
                  pills
                  className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                  role="tablist"
                >
                  <NavItem>
                    <NavLink
                      href="#"
                      className={classNames({
                        active: activeTab === "1",
                      })}
                      onClick={() => {
                        toggleTab("1");
                      }}
                      title="Order Detail"
                    >
                      <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                      <span
                        className="d-none d-md-inline-block fw-bold"
                        style={{ color: "rgb(0,37,56)" }}
                      >
                        Order Detail
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="#"
                      className={classNames({
                        active: activeTab === "2",
                      })}
                      onClick={() => {
                        toggleTab("2");
                      }}
                      title="Item Detail"
                    >
                      <i className="ri-list-unordered d-inline-block d-md-none"></i>{" "}
                      <span
                        className="d-none d-md-inline-block fw-bold"
                        style={{ color: "rgb(0,37,56)" }}
                      >
                        Item Detail
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav> */}
              </div>
              <Card>
                <CardBody>
                  <TabContent activeTab={activeTab} className="pt-4 text-muted">
                    <TabPane tabId="1">
                      {/* <OrderTable bookingDetail={bookingDetail} /> */}
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </CustomerContext.Provider>
    </div>
  );
};

export default CustomerDetail;
