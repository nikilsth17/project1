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
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";

import { useParams } from "react-router-dom";
import NumberWithCommas from "../Starter/NumberWithCommas";
//Images
import profileBg from "../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import EmployeeTxnDetailService from "../../../services/HRService/EmployeeTxnDetailService";

const defData = {
  id: 16,
  name: "rushali lage",
  dob: "2023-10-04T10:25:23.843",
  _Gender: 1,
  gender: "Female",
  email: "ruhshalilage123@gmail.com",
  phoneNumber: "9800112233",
  address: "libali,Bkt",
  nationality: "Nepali",
  advanceRecords: [
    {
      id: 59,
      _TxnDate: "2022-01-05T00:00:00",
      txnDate: "2022/01/05",
      amount: 44.0,
      ref_No: "78uuuyygdhghe7",
    },
    {
      id: 70,
      _TxnDate: "2022-01-01T00:00:00",
      txnDate: "2022/01/01",
      amount: 6006.0,
      ref_No: "emp remarks 66",
    },
  ],
  productionRecords: [
    {
      id: 55,
      _TxnDate: "2022-01-20T00:00:00",
      production_Date: "2022/01/20",
      rate: 0,
      qty: 500.0,
      ref_No: "20",
    },
  ],
  shiftingToDockRecords: [
    {
      id: 61,
      _TxnDate: "2022-01-12T00:00:00",
      shifting_Date: "2022/01/12",
      qty: 777.0,
      rate: 0,
      ref_No: "6767",
    },
  ],
  shiftingToCounterRecords: [
    {
      id: 68,
      _TxnDate: "2022-01-01T00:00:00",
      shifting_Date: "2022/01/01",
      qty: 0.0,
      rate: 0,
      ref_No: "8",
    },
  ],
  monthlyPayrolls: [
    {
      id: 81,
      _TxnDate: "2023-10-08T07:21:07.243",
      txn_Date: "2023/10/08",
      salary: 1247.4,
      ref_No: "90",
    },
  ],
};

const EmployeeWithTxnDetailList = (props) => {
  const { id } = useParams();
  console.log(id);

  SwiperCore.use([Autoplay]);

  const [activeTab, setActiveTab] = useState("1");
  const [activityTab, setActivityTab] = useState("1");
  const [employeeDetails, setemployeeDetail] = useState(defData);
  async function fetchPosts() {
    try {
      //   const fetchedPosts = await EmployeeTxnDetailService.view(id);
      const fetchedPosts = await EmployeeTxnDetailService.view(id);
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
              <img src={profileBg} alt="" className="profile-wid-img" />
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
                    {employeeDetails.dob
                      .split("T")[0]
                      .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")}
                  </p>

                  <div className="hstack text-white-50 gap-1">
                    <div className="me-2">
                      <i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
                      {employeeDetails.gender}
                    </div>
                    <div>
                      <i className="ri-building-line me-1 text-white text-opacity-75 fs-16 align-bottom"></i>
                      {employeeDetails.email}
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} className="col-lg-auto order-last order-lg-0">
                <Row className="text text-white-50 text-center">
                  <Col lg={6} xs={4}>
                    <div className="p-2">
                      <h4 className="text-white mb-1">
                        {employeeDetails.phoneNumber}
                      </h4>
                      <p className="fs-15 mb-0">{employeeDetails.address}</p>
                    </div>
                  </Col>
                  <Col lg={6} xs={4}>
                    <div className="p-2">
                      <h4 className="text-white mb-1">
                        {employeeDetails.nationality}
                      </h4>
                      <p className="fs-15 mb-0">Nepal</p>
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
                          Advance
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
                          Production
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
                      >
                        <i className="ri-price-tag-line d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          ShiftingToDock
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#documents"
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => {
                          toggleTab("4");
                        }}
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          ShiftingToCounter
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#overview-tab"
                        className={classnames({ active: activeTab === "5" })}
                        onClick={() => {
                          toggleTab("5");
                        }}
                      >
                        <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          Payrolls
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        href="#overview-tab"
                        className={classnames({ active: activeTab === "6" })}
                        onClick={() => {
                          toggleTab("6");
                        }}
                      >
                        <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          Vehicle LogBook
                        </span>
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        href="#activities"
                        className={classnames({ active: activeTab === "7" })}
                        onClick={() => {
                          toggleTab("7");
                        }}
                      >
                        <i className="ri-list-unordered d-inline-block d-md-none"></i>{" "}
                        <span className="d-none d-md-inline-block">
                          Settlement
                        </span>
                      </NavLink>
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
                                    <th scope="col">Adv.TxnDate</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Ref_No</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(employeeDetails.advanceRecords || []).map(
                                    (item, index) => (
                                      <tr key={item.id}>
                                        <td>{index + 1}</td>

                                        <td>
                                          {item._TxnDate
                                            .split("T")[0]
                                            .replace(
                                              /(\d{4})-(\d{2})-(\d{2})/,
                                              "$1-$2-$3"
                                            )}
                                        </td>
                                        <td>
                                        <NumberWithCommas 
                                  number={item.amount}
                                  />
                                          </td>
                                        <td>{item.ref_No}</td>
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
                              Production Records
                            </h5>
                          </div>
                          <Row>
                            <Col lg={12}>
                              <div className="table-responsive">
                                <Table className="table-borderless align-middle mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th scope="col">SN</th>
                                      <th scope="col">Prod.TDate</th>

                                      <th scope="col">Rate</th>
                                      <th scope="col">Quant.</th>
                                      <th scope="col">Ref_No</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(
                                      employeeDetails.productionRecords || []
                                    ).map((item, index) => (
                                      <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        {/* <td>{item._TxnDate}</td> */}
                                        <td>
                                          {item._TxnDate
                                            .split("T")[0]
                                            .replace(
                                              /(\d{4})-(\d{2})-(\d{2})/,
                                              "$1-$2-$3"
                                            )}
                                        </td>

                                        <td>
                                        <NumberWithCommas 
                                  number={item.rate}/>
                                  </td>
                                        <td>
                                        <NumberWithCommas 
                                  number={item.qty}/>
                                  </td>
                                        <td>{item.ref_No}</td>
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

                  <TabPane tabId="3">
                    {/* Shifting To dock */}
                    <Card>
                      <CardBody>
                        <div className="d-flex align-items-center mb-4">
                          <h5 className="card-title flex-grow-1 mb-0">
                            Shifting To Dock Records
                          </h5>
                        </div>
                        <Row>
                          <Col lg={12}>
                            <div className="table-responsive">
                              <Table className="table-borderless align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">SN</th>
                                    <th scope="col">ShiftingToDock TxnDate</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Rate</th>
                                    <th scope="col">Ref_No</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(
                                    employeeDetails.shiftingToDockRecords || []
                                  ).map((item, index) => (
                                    <tr key={item.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {item._TxnDate
                                          .split("T")[0]
                                          .replace(
                                            /(\d{4})-(\d{2})-(\d{2})/,
                                            "$1-$2-$3"
                                          )}
                                      </td>
                                      <td>
                                      <NumberWithCommas 
                                  number={item.qty} />
                                  </td>
                                      <td>
                                      <NumberWithCommas 
                                  number={item.rate} />
                                  </td>
                                      <td>{item.ref_No}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </TabPane>

                  <TabPane tabId="4">
                    <Card>
                      <CardBody>
                        <div className="d-flex align-items-center mb-4">
                          <h5 className="card-title flex-grow-1 mb-0">
                            Shifting To Counter Records
                          </h5>
                        </div>
                        <Row>
                          <Col lg={12}>
                            <div className="table-responsive">
                              <Table className="table-borderless align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">SN</th>
                                    <th scope="col">
                                      ShiftingToCounter TxnDate
                                    </th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Rate</th>
                                    <th scope="col">Ref_No</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(
                                    employeeDetails.shiftingToCounterRecords ||
                                    []
                                  ).map((item, index) => (
                                    <tr key={item.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {item._TxnDate
                                          .split("T")[0]
                                          .replace(
                                            /(\d{4})-(\d{2})-(\d{2})/,
                                            "$1-$2-$3"
                                          )}
                                      </td>
                                      <td>
                                      <NumberWithCommas 
                                  number={item.qty} />
                                  </td>
                                      <td>
                                      <NumberWithCommas 
                                  number={item.rate } />
                                  </td>
                                      <td>{item.ref_No}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </TabPane>

                  <TabPane tabId="5">
                    <Card>
                      <CardBody>
                        <div className="d-flex align-items-center mb-4">
                          <h5 className="card-title flex-grow-1 mb-0">
                            Monthly Records
                          </h5>
                        </div>
                        <Row>
                          <Col lg={12}>
                            <div className="table-responsive">
                              <Table className="table-borderless align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">SN</th>
                                    <th scope="col">Monthly TxnDate</th>
                                    <th scope="col">Salary</th>
                                    <th scope="col">Ref_No</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(employeeDetails.monthlyPayrolls || []).map(
                                    (item, index) => (
                                      <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                          {item._TxnDate
                                            .split("T")[0]
                                            .replace(
                                              /(\d{4})-(\d{2})-(\d{2})/,
                                              "$1-$2-$3"
                                            )}
                                        </td>
                                        <td>
                                        <NumberWithCommas 
                                  number={item.salary} />
                                  </td>
                                        <td>{item.ref_No}</td>
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

                  {/* Vehicle LogBook */}
                  <TabPane tabId="6">
                    <Card>
                      <CardBody>
                        <div className="d-flex align-items-center mb-4">
                          <h5 className="card-title flex-grow-1 mb-0">
                            Vehicle LogBook
                          </h5>
                        </div>
                        <Row>
                          <Col lg={12}>
                            <div className="table-responsive">
                              <Table className="table-borderless align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">SN</th>
                                    <th scope="col">Vehicle Number</th>
                                    <th scope="col">Destination</th>
                                    <th scope="col">Transaction Date</th>
                                    <th scope="col">Transaction Quantity</th>
                                    <th scope="col">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(employeeDetails.vehicleLogBook || []).map(
                                    (item, index) => (
                                      <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.vehicleNo}</td>
                                        <td>{item.destination}</td>
                                        <td>
                                          {item._TxnDate
                                            .split("T")[0]
                                            .replace(
                                              /(\d{4})-(\d{2})-(\d{2})/,
                                              "$1-$2-$3"
                                            )}
                                        </td>
                                        <td>
                                        <NumberWithCommas 
                                  number={item.txn_Qty} />
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

                  {/* Settlement */}
                  <TabPane tabId="7">
                    <Card>
                      <CardBody>
                        <div className="d-flex align-items-center mb-4">
                          <h5 className="card-title flex-grow-1 mb-0">
                            Settlement
                          </h5>
                        </div>
                        <Row>
                          <Col lg={12}>
                            <div className="table-responsive">
                              <Table className="table-borderless align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">SN</th>
                                    <th scope="col">Settlement Date</th>
                                    <th scope="col">Remarks</th>
                                    <th scope="col">Verified By</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(employeeDetails.settements || []).map(
                                    (item, index) => (
                                      <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                          {item._TxnDate
                                            .split("T")[0]
                                            .replace(
                                              /(\d{4})-(\d{2})-(\d{2})/,
                                              "$1-$2-$3"
                                            )}
                                        </td>
                                        <td>{item.remarks}</td>
                                        <td>{item.verified_By}</td>
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
                </TabContent>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeWithTxnDetailList;
