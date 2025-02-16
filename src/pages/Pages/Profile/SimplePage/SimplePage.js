import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Nav, NavItem, NavLink, Pagination, PaginationItem, PaginationLink, Progress, Row, TabContent, Table, TabPane, UncontrolledCollapse, UncontrolledDropdown } from 'reactstrap';
import classnames from 'classnames';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";


//Images
import profileBg from '../../../../assets/images/profile-bg.jpg';
import avatar1 from '../../../../assets/images/users/avatar-1.jpg';
import avatar2 from '../../../../assets/images/users/avatar-2.jpg';
import avatar3 from '../../../../assets/images/users/avatar-3.jpg';
import avatar4 from '../../../../assets/images/users/avatar-4.jpg';
import avatar5 from '../../../../assets/images/users/avatar-5.jpg';
import avatar6 from '../../../../assets/images/users/avatar-6.jpg';
import avatar7 from '../../../../assets/images/users/avatar-7.jpg';
import avatar8 from '../../../../assets/images/users/avatar-8.jpg';

import smallImage2 from '../../../../assets/images/small/img-2.jpg';
import smallImage3 from '../../../../assets/images/small/img-3.jpg';
import smallImage4 from '../../../../assets/images/small/img-4.jpg';
import smallImage5 from '../../../../assets/images/small/img-5.jpg';
import smallImage6 from '../../../../assets/images/small/img-6.jpg';
import smallImage7 from '../../../../assets/images/small/img-7.jpg';
import smallImage9 from '../../../../assets/images/small/img-9.jpg';


import { projects, document } from '../../../../common/data';
import EmployeeWithTxnDetailList from '../../Employee/EmployeeWithTxnDetailList';
// import EmployeeTxnDetailService from "../HRService/EmployeeTxnDetailService";



const defData = 
{
    "id": 16,
    "name": "rushali lage",
    "dob": "2023-10-04T10:25:23.843",
    "_Gender": 1,
    "gender": "Female",
    "email": "ruhshalilage123@gmail.com",
    "phoneNumber": "9800112233",
    "address": "libali,Bkt",
    "nationality": "Nepali",
    "advanceRecords": [
        {
            "id": 59,
            "_TxnDate": "2022-01-05T00:00:00",
            "txnDate": "2022/01/05",
            "amount": 44.00,
            "ref_No": "78uuuyygdhghe7"
        },
        {
            "id": 70,
            "_TxnDate": "2022-01-01T00:00:00",
            "txnDate": "2022/01/01",
            "amount": 6006.00,
            "ref_No": "emp remarks 66"
        }
    ],
    "productionRecords": [
        {
            "id": 55,
            "_TxnDate": "2022-01-20T00:00:00",
            "production_Date": "2022/01/20",
            "rate": 0,
            "qty": 500.00,
            "ref_No": "20"
        }
    ],
    "shiftingToDockRecords": [
        {
            "id": 61,
            "_TxnDate": "2022-01-12T00:00:00",
            "shifting_Date": "2022/01/12",
            "qty": 777.00,
            "rate": 0,
            "ref_No": "6767"
        }
    ],
    "shiftingToCounterRecords": [
        {
            "id": 68,
            "_TxnDate": "2022-01-01T00:00:00",
            "shifting_Date": "2022/01/01",
            "qty": 0.00,
            "rate": 0,
            "ref_No": "8"
        }
    ],
    "monthlyPayrolls": [
        {
            "id": 81,
            "_TxnDate": "2023-10-08T07:21:07.243",
            "txn_Date": "2023/10/08",
            "salary": 1247.40,
            "ref_No": "90"
        }
    ]
}

const SimplePage = () => {

    SwiperCore.use([Autoplay]);


    const [activeTab, setActiveTab] = useState('1');
    const [activityTab, setActivityTab] = useState('1');
    const [employeeDetails, setemployeeDetail] = useState(defData);
    async function fetchPosts() {
        try {
        //   const fetchedPosts = await EmployeeTxnDetailService.view(id);
        const fetchedPosts =await EmployeeWithTxnDetailList.view(id);
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
                <Container fluid>
                    <div className="profile-foreground position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg">
                            <img src={profileBg} alt="" className="profile-wid-img" />
                        </div>
                    </div>
                    <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
                        <Row className="g-4">
                            <div className="col-auto">
                                <div className="avatar-lg">
                                    <img src={avatar1} alt="user-img"
                                        className="img-thumbnail rounded-circle" />
                                </div>
                            </div>

                            <Col>
                                <div className="p-2">
                                    <h3 className="text-white mb-1">Anna Adame</h3>
                                    <p className="text-white text-opacity-75">Owner & Founder</p>
                                    <div className="hstack text-white-50 gap-1">
                                        <div className="me-2"><i
                                            className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>California,
                                            United States</div>
                                        <div><i
                                            className="ri-building-line me-1 text-white text-opacity-75 fs-16 align-bottom"></i>Themesbrand
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} className="col-lg-auto order-last order-lg-0">
                                <Row className="text text-white-50 text-center">
                                    <Col lg={6} xs={4}>
                                        <div className="p-2">
                                            <h4 className="text-white mb-1">24.3K</h4>
                                            <p className="fs-15 mb-0">Followers</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} xs={4}>
                                        <div className="p-2">
                                            <h4 className="text-white mb-1">1.3K</h4>
                                            <p className="fs-15 mb-0">Following</p>
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
                                    <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                href="#overview-tab"
                                                className={classnames({ active: activeTab === '1' })}
                                                onClick={() => { toggleTab('1'); }}
                                            >
                                                <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">AdvanceRecords</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#activities"
                                                className={classnames({ active: activeTab === '2' })}
                                                onClick={() => { toggleTab('2'); }}
                                            >
                                                <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">ProductionRecords</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#projects"
                                                className={classnames({ active: activeTab === '3' })}
                                                onClick={() => { toggleTab('3'); }}
                                            >
                                                <i className="ri-price-tag-line d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">ShiftingToDockRecords</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#documents"
                                                className={classnames({ active: activeTab === '4' })}
                                                onClick={() => { toggleTab('4'); }}
                                            >
                                                <i className="ri-folder-4-line d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">ShiftingToCounter Records</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#overview-tab"
                                                className={classnames({ active: activeTab === '5' })}
                                                onClick={() => { toggleTab('5'); }}
                                            >
                                                <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
                                                    className="d-none d-md-inline-block">Payrolls</span>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <div className="flex-shrink-0">
                                        <Link to="/pages-profile-settings" className="btn btn-success"><i
                                            className="ri-edit-box-line align-bottom"></i> Edit Profile</Link>
                                    </div>
                                </div>

                                <TabContent activeTab={activeTab} className="pt-4 text-muted">
                                    <TabPane tabId="1">
                                        {/* Advance Records */}
                                        <Card>
                                            <CardBody>
                                                <div className="d-flex align-items-center mb-4">
                                                    <h5 className="card-title flex-grow-1 mb-0">Advance Records</h5>
                                                   
                                                </div>
                                                <Row>
                                                    <Col lg={12}>
                                                        <div className="table-responsive">
                                                            <Table className="table-borderless align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th scope="col">ID</th>
                                                                        <th scope="col">Adv.TxnDate</th>
                                                                        <th scope="col">Amount</th>
                                                                        <th scope="col">Ref_No</th>
                                                                        
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(employeeDetails.advanceRecords|| []).map((item, key) => (
                                                                        <tr key={key}>
                                                                            <td>{item.id}</td>
                                                                            <td>{item.txnDate}</td>
                                                                            <td>{item.amount}</td>
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
                                    <TabPane tabId="2">
                                        <Card>
                                            {/* Production Record */}

                                            <Card>
                                            <CardBody>
                                                <div className="d-flex align-items-center mb-4">
                                                    <h5 className="card-title flex-grow-1 mb-0">Production Records</h5>
                                                   
                                                </div>
                                                <Row>
                                                    <Col lg={12}>
                                                        <div className="table-responsive">
                                                            <Table className="table-borderless align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th scope="col">ID</th>
                                                                        <th scope="col">Prod.TDate</th>
                                                                        <th scope="col">Prod.Date</th>
                                                                        <th scope="col">Rate</th>
                                                                        <th scope="col">Quant.</th>
                                                                        <th scope="col">Ref.R</th>
                                                                        
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(employeeDetails.productionRecords|| []).map((item, key) => (
                                                                        <tr key={key}>
                                                                            <td>{item.id}</td>
                                                                            <td>{item._TxnDate}</td>
                                                                            <td>{item.production_Date}</td>
                                                                            <td>{item.rate}</td>
                                                                            <td>{item.qty}</td>
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
                                                    <h5 className="card-title flex-grow-1 mb-0">Shifting To Dock Records</h5>
                                                   
                                                </div>
                                                <Row>
                                                    <Col lg={12}>
                                                        <div className="table-responsive">
                                                            <Table className="table-borderless align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th scope="col">ID</th>
                                                                        <th scope="col">ShiftingToDock TxnDate</th>
                                                                        <th scope="col">Quantity</th>
                                                                        <th scope="col">Rate</th>
                                                                        <th scope="col">Reference Rate</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(employeeDetails.shiftingToDockRecords || []).map((item, key) => (
                                                                        <tr key={key}>
                                                                            <td>{item.id}</td>
                                                                            <td>{item._TxnDate}</td>
                                                                            <td>{item.qty}</td>
                                                                            <td>{item.rate}</td>
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
                                                    <h5 className="card-title flex-grow-1 mb-0">Shifting To Counter Records</h5>
                                                   
                                                </div>
                                                <Row>
                                                    <Col lg={12}>
                                                        <div className="table-responsive">
                                                            <Table className="table-borderless align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th scope="col">ID</th>
                                                                        <th scope="col">ShiftingToCounter TxnDate</th>
                                                                        <th scope="col">Quantity</th>
                                                                        <th scope="col">Rate</th>
                                                                        <th scope="col">Reference Rate</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(employeeDetails.shiftingToCounterRecords || []).map((item, key) => (
                                                                        <tr key={key}>
                                                                            <td>{item.id}</td>
                                                                            <td>{item._TxnDate}</td>
                                                                            <td>{item.qty}</td>
                                                                            <td>{item.rate}</td>
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
                                                    <h5 className="card-title flex-grow-1 mb-0">Monthly Records</h5>
                                                   
                                                </div>
                                                <Row>
                                                    <Col lg={12}>
                                                        <div className="table-responsive">
                                                            <Table className="table-borderless align-middle mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th scope="col">ID</th>
                                                                        <th scope="col">Monthly TxnDate</th>
                                                                        <th scope="col">Salary</th>
                                                                        <th scope="col">Reference Rate</th>
                                                                        
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(employeeDetails.monthlyPayrolls || []).map((item, key) => (
                                                                        <tr key={key}>
                                                                            <td>{item.id}</td>
                                                                            <td>{item._TxnDate}</td>
                                                                            <td>{item.salary}</td>
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
                                </TabContent>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default SimplePage;