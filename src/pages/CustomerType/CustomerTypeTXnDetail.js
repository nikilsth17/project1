import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Row,
  TabContent,
  Table,
  TabPane,
  UncontrolledCollapse,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import {Swiper, SwiperSlide} from "swiper";
import SwiperCore, { Autoplay } from "swiper";
import { useParams } from "react-router-dom";
import CustomerServices from "../../services/Inventory Services/CustomerServices";
const defData = {
    id: 25,
    name: "Shyam kumar Lage",
    address: "Patan",
    registration_No: "1_H",
    tel_No: "9810100178",
    opening_Balance: 600,
    registered_Date: "2023-10-17T00:00:00",
    ledger_code: "1",
    purchases: [
      {
        id: 42,
        _date: "2023-11-10T00:00:00",
        date: "2023/11/10",
        vendorId: 25,
        vendorName: "Shyam kumar Lage",
        invoice_No: "001612",
        net_Amt: 15.2,
        remarks: "cash",
      },
      {
        id: 46,
        _date: "2023-11-10T00:00:00",
        date: "2023/11/10",
        vendorId: 25,
        vendorName: "Shyam kumar Lage",
        invoice_No: "0016122",
        net_Amt: 182.4,
        remarks: "cash",
      },
    ],
    fuelLogBook: [
      {
        _date: "2023-11-15T00:00:00",
        date: "2023/11/15",
        time: "12/00 AM",
        pumpId: 25,
        pumpName: "Shyam kumar Lage",
        quantity: 10,
        token_No: "1_p",
        remarks: "cash",
      },
    ],
  };
import NumberWithCommas from "../Pages/Starter/NumberWithCommas";


const CustomerTypeTXnDetail = () => {
    const { id } = useParams();
    console.log(id);
  
    SwiperCore.use([Autoplay]);
  
    const [activeTab, setActiveTab] = useState("1");
    const [activityTab, setActivityTab] = useState("1");
    const [employeeDetails, setemployeeDetail] = useState(defData);
    async function fetchPosts() {
      try {
        //   const fetchedPosts = await EmployeeTxnDetailService.view(id);
        const fetchedPosts = await CustomerServices.view(id);
        console.log("Fetched Posts:", fetchedPosts); // Debugging line
        setemployeeDetail(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  
    useEffect(() => {
      fetchPosts();
    }, []);
  
    const toggleTab = (tab) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
      }
    };
  
    const toggleActivityTab = (tab) => {
      if (activityTab !== tab) {
        setActivityTab(tab);
      }
    };
  
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <div className="profile-foreground position-relative mx-n4 mt-n4">
              <div className="profile-wid-bg">
                {/* <img src={profileBg} alt="" className="profile-wid-img" /> */}
              </div>
            </div>
            <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
              <Row className="g-4">
                {/* <div className="col-auto">
                                  <div className="avatar-lg">
                                      <img src={avatar1} alt="user-img"
                                          className="img-thumbnail rounded-circle" />
                                  </div>
                              </div> */}
  
                <Col>
                  <div className="p-2">
                    <h3 className="text-white mb-1">{employeeDetails.name}</h3>
  
                    <p className="text-white text-opacity-75">
                      {employeeDetails.registered_Date
                        .split("T")[0]
                        .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")}
                    </p>
  
                    <div className="hstack text-white-50 gap-1 align-items-center">
    <div className="me-2 d-flex align-items-center">
      <i className="ri-money-dollar-circle-fill" style={{ fontSize: '2em', color: 'black' }}></i>
      {" "}
      <NumberWithCommas 
                                    number={employeeDetails.opening_Balance}
    />
                                    </div>
  </div>
  
                    {/* 
                    <div className="hstack text-white-50 gap-1">
                      <div className="me-2">
                        <i className="ri-money-dollar-circle-fill"
                        style={{ fontSize: '2em', color: 'black' }}></i>
                        {" "}
                        {employeeDetails.opening_Balance}
                      </div>
                      <div>
                        <i className="ri-building-line me-1 text-white text-opacity-75 fs-16 align-bottom"></i>
                        {employeeDetails.email}
                      </div>
                    </div> */}
                  </div>
                </Col>
  
                <Col xs={12} className="col-lg-auto order-last order-lg-0">
                  <Row className="text text-white-50 text-center">
                    <Col lg={6} xs={4}>
                      <div className="p-2">
                        <h4 className="text-white mb-1">
                          {employeeDetails.tel_No}
                        </h4>
                        <div className="d-flex align-items-center">
                          <i
                            className="ri-home-6-fill"
                            style={{ fontSize: "1.5em", color: "black" }}
                          ></i>
                          <p className="fs-15 mb-0 ms-2">
                            {employeeDetails.address}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={6} xs={4}>
                      <div className="p-2">
                        <h4 className="text-white mb-1">
                          {employeeDetails.registration_No}
                        </h4>
                        {/* <p className="fs-15 mb-0">Nepal</p> */}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
  
            <Row>
              <Col lg={12}>
                <div>
                  <div className="d-flex">
                    <Nav
                      pills
                      className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                      role="tablist"
                    >
                      <NavItem>
                        <NavLink
                          href="#overview-tab"
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => {
                            toggleTab("1");
                          }}
                        >
                          <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                          <span className="d-none d-md-inline-block">
                            Purchase
                          </span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          href="#activities"
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => {
                            toggleTab("2");
                          }}
                        >
                          <i className="ri-list-unordered d-inline-block d-md-none"></i>{" "}
                          <span className="d-none d-md-inline-block">
                            Fuel LogBook
                          </span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          href="#projects"
                          className={classnames({ active: activeTab === "3" })}
                          onClick={() => {
                            toggleTab("3");
                          }}
                        ></NavLink>
                      </NavItem>
                    </Nav>
                    <div className="flex-shrink-0">
                      {/* <Link to="/pages-profile-settings" className="btn btn-success"><i
                                              className="ri-edit-box-line align-bottom"></i> Edit Profile</Link> */}
                    </div>
                  </div>
  
                  <TabContent activeTab={activeTab} className="pt-4 text-muted">
                    <TabPane tabId="1">
                      {/* Advance Records */}
                      <Card>
                        <CardBody>
                          <div className="d-flex align-items-center mb-4">
                            <h5 className="card-title flex-grow-1 mb-0">
                              Advance Records
                            </h5>
                          </div>
                          <Row>
                            <Col lg={12}>
                              <div className="table-responsive">
                                <Table className="table-borderless align-middle mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th scope="col">SN</th>
                                      <th scope="col">Date</th>
                                      <th scope="col">Vendor</th>
                                      <th scope="col">Invoice No.</th>
                                      <th scope="col">Net Amount</th>
                                      <th scope="col">Remarks</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(employeeDetails.purchases || []).map(
                                      (item, index) => (
                                        <tr key={item.id}>
                                          <td>{index + 1}</td>
  
                                          <td>
                                            {item._date
                                              .split("T")[0]
                                              .replace(
                                                /(\d{4})-(\d{2})-(\d{2})/,
                                                "$1-$2-$3"
                                              )}
                                          </td>
                                          <td>{item.vendorName}</td>
                                          <td>{item.invoice_No}</td>
                                          <td> <NumberWithCommas 
                                    number={item.net_Amt} />
                                    </td>
                                          <td>{item.remarks}</td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </TabPane>
                    <TabPane tabId="2">
                      <Card>
                        {/* Production Record */}
  
                        <Card>
                          <CardBody>
                            <div className="d-flex align-items-center mb-4">
                              <h5 className="card-title flex-grow-1 mb-0">
                                fuelLogBook Records
                              </h5>
                            </div>
                            <Row>
                              <Col lg={12}>
                                <div className="table-responsive">
                                  <Table className="table-borderless align-middle mb-0">
                                    <thead className="table-light">
                                      <tr>
                                        <th scope="col">SN</th>
                                        <th scope="col">Date</th>
  
                                        <th scope="col">Time</th>
                                        <th scope="col">Pump</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Token No.</th>
                                        <th scope="col">Remarks</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(employeeDetails.fuelLogBook || []).map(
                                        (item, index) => (
                                          <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            {/* <td>{item._TxnDate}</td> */}
                                            <td>
                                              {item._date
                                                .split("T")[0]
                                                .replace(
                                                  /(\d{4})-(\d{2})-(\d{2})/,
                                                  "$1-$2-$3"
                                                )}
                                            </td>
  
                                          <td>{item.time}</td>
                                          <td>{item.pumpName}</td>
                                          <td>
                                          <NumberWithCommas 
                                    number={item.quantity} />
                                    </td>
                                          <td>{item.token_No}</td>
                                          <td>{item.remarks}</td>
                                          
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Card>
                    </TabPane>
                  </TabContent>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
  )
}

export default CustomerTypeTXnDetail