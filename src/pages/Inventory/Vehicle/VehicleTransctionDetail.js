import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Button,
} from "reactstrap";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import { useParams } from "react-router-dom";
//Images
import profileBg from "../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import EmployeeTxnDetailService from "../../../services/HRService/EmployeeTxnDetailService";
import VehicleServices from "../../../services/Inventory Services/VehicleServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CreateButton from "../../Pages/Starter/CreateButton";

const defData = {
  id: 27,
  vehicleTypeId: 17,
  vehicleType: "Brick Machine",
  fuelTypeId: 2,
  fuelType: "Diesel",
  vehicle_No: "J-90",
  vehicle_Model: "BZ-2",
  fuelLogBook: [
    {
      _date: "2023-11-12T00:00:00",
      date: "2023/11/12",
      time: "12/00 AM",
      pumpId: 27,
      pumpName: "Roshna Koju",
      quantity: 50,
      token_No: "13_k",
      remarks: "sand",
    },
  ],
  vehicleLogBook: [
    {
      destination: "bktr",
      _TxnDate: "2023-11-07T00:00:00",
      txnDate: "2023/11/07 12/00 AM",
      txn_Qty: 5,
      remarks: "hello",
    },
  ],
};

function VehicleTransctionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  SwiperCore.use([Autoplay]);

  const [activeTab, setActiveTab] = useState("1");
  const [activityTab, setActivityTab] = useState("1");
  const [employeeDetails, setemployeeDetail] = useState(defData);
  async function fetchPosts() {
    try {
      //   const fetchedPosts = await EmployeeTxnDetailService.view(id);
      const fetchedPosts = await VehicleServices.vehicletransctionDetail(id);
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

  document.title = "Profile | Ants Quality Management System";
  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Vehicle Detail" pageTitle="Vehicle" />
        <Container fluid>
          <Card>
            <CardHeader>
            <CreateButton to="/vehicle-list" text="  Back to List" />
          </CardHeader>
          <CardBody>
            <CardHeader>
            <Col lg={12}>
                    <CardBody className="p-4">
                      <Row className="g-3">
                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">Vehicle</p>
                          <h5 className="fs-15 mb-0"><span id="invoice-no">{employeeDetails.vehicleType}</span></h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">Fuel</p>
                          <h5 className="fs-15 mb-0"><span id="invoice-date">   {employeeDetails.fuelType}</span> <small className="text-muted" id="invoice-time"></small></h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13"> Vehicle No</p>
                          <span className="badge bg-success-subtle text-success fs-11" id="payment-status"> {employeeDetails.vehicle_No}</span>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">Vehicle Model</p>
                          <h5 className="fs-15 mb-0"><span id="total-amount">{employeeDetails.vehicle_Model}</span></h5>
                        </Col>

                      </Row>

                    </CardBody>

                  </Col>
            
                
                      {/* <tr>
                        <th className="ps-5" scope="row">
                          ID:
                        </th>
                        <td className="text-muted">{employeeDetails.id}</td>
                      </tr> */}
                   
                        {/* <th className="ps-5" scope="row">
                            VehicleTypeId:
                            </th>
                            <td className="text-muted">
                              {employeeDetails.vehicleTypeId}
                            </td> */}
                     
                        {/* <th className="ps-5" scope="row">
                          Vehicle:
                        </th>
                        <td className="text-muted">
                          {employeeDetails.vehicleType}
                        </td> */}
                    
                        {/* <th className="ps-5" scope="row">
                            FuelTypeId:
                            </th>
                            <td className="text-muted">
                              {employeeDetails.fuelTypeId}
                            </td> */}
                    
                        {/* <th className="ps-5" scope="row">
                          Fuel:
                        </th>
                        <td className="text-muted">
                          {employeeDetails.fuelType}
                        </td>
                    
                        <th className="ps-5" scope="row">
                          Vehicle No:
                        </th>
                        <td className="text-muted">
                          {employeeDetails.vehicle_No}
                        </td>
                  
                        <th className="ps-5" scope="row">
                          Vehicle Model:
                        </th>
                        <td className="text-muted">
                          {employeeDetails.vehicle_Model}
                        </td> */}
                    
                   
             
      
          </CardHeader>

        <div  className="pt-6 mb-7">
          <Row>
            <Col lg={12}>
              <div>
                <div className="d-flex">
                  <Nav
                    pills
                    tabs
                    className="nav-tabs-custom nav-success"
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
                        <span
                          className="d-none d-md-inline-block"
                          style={{ color: "black" }}
                        >
                          Fuel LogBook
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
                        <span
                          className="d-none d-md-inline-block"
                          style={{ color: "black" }}
                        >
                          Vehicle LogBook
                        </span>
                      </NavLink>
                    </NavItem>
                    {/* <NavItem>
                    <NavLink
                      href="#projects"
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => {
                        toggleTab("3");
                      }}
                    >
                  
                      <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                      <span className="d-none d-md-inline-block">
                        Payrolls
                      </span>
                    </NavLink>
                  </NavItem> */}
                  </Nav>
                  <div className="flex-shrink-0">
                    {/* <Link to="/pages-profile-settings" className="btn btn-success"><i
                                          className="ri-edit-box-line align-bottom"></i> Edit Profile</Link> */}
                  </div>
                </div>

                <TabContent activeTab={activeTab} className="pt-4 text-muted">
                  <TabPane tabId="1">
                    {/* Advance Records */}
                 
                        <div className="d-flex align-items-center mb-4">
                          <h5 className="card-title flex-grow-1 mb-0">
                        
                          </h5>
                        </div>
                        <Row>
                          <Col lg={12}>
                            <div className="table-responsive">
                              <Table className="table-borderless align-middle ">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">SN</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Pump</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Token No</th>
                                    <th scope="col">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(employeeDetails.fuelLogBook || []).map(
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
                                      <td>{item.time}</td>
                                      <td>{item.pumpName}</td>
                                      <td>
                                      <NumberWithCommas 
                                  number={item.quantity} />
                                  </td>
                                      <td>{item.token_No}</td>
                                      <td>{item.remarks}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                        
                      </Row>
            
                </TabPane>
                <TabPane tabId="2">
               
                    {/* Production Record */}

                    
                          <div className="d-flex align-items-center mb-4">
                            <h5 className="card-title flex-grow-1 mb-0">
                             
                            </h5>
                          </div>
                          <Row>
                            <Col lg={12}>
                              <div className="table-responsive">
                                <Table className="table-borderless align-middle mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th scope="col">SN</th>
                                      <th scope="col">Destination</th>

                                    <th scope="col">Txn Date</th>
                                    <th scope="col">Txn Quantity</th>
                                    <th scope="col">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(
                                    employeeDetails.vehicleLogBook || []
                                  ).map((item, index) => (
                                    <tr key={item.id}>
                                      <td>{index + 1}</td>
                                     <td>{item.destination}</td>
                                      
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
                                  number={item.txn_Qty} />
                                  </td>
                                      <td>{item.remarks}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </Col>
                        </Row>
                    
                 
                </TabPane>

             
              </TabContent>
            </div>
          </Col>
        </Row>
        </div>
        </CardBody>
        </Card>
      
      </Container>
    </div>
  </React.Fragment>
  )
}

export default VehicleTransctionDetail;
