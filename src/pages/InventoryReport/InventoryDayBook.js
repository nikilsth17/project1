import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
  FormGroup,
  Button,
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
import InventoryDayBookService from "../../services/Inventory Services/InventoryDayBook";
import { useNavigate } from "react-router-dom";
import profileBg from "../../assets/images/profile-bg.jpg";
import NumberWithCommas from "../Pages/Starter/NumberWithCommas";

const InventoryDayBook = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [activeTab, setActiveTab] = useState("1");
  const [activityTab, setActivityTab] = useState("1");

  const [reportData, setReportData] = useState({
    itemWiseSalesRecords: [],
    itemWisePurchaseRecords: [],
    customerWiseSalesRecords: [],
    vendorWisePurchaseRecords: [],
  });
  const navigate = useNavigate();

  // Function to get the current date in the format "YYYY-MM-DD"
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function fetchPosts(selectedDate) {
    try {
      const response = await InventoryDayBookService.getList(selectedDate);

      console.log(response);
      setReportData(response);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }
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

  const generateVoucher = () => {
    navigate(`/inventorydaybook-report/${selectedDate}`);
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchPosts(selectedDate);
  }, [selectedDate]);

  return (
    <div className="page-content">
      <BreadCrumb title="Inventory DayBook" pageTitle="Inventory " />
      <Container fluid>
        <Row>
          <Card>
            <CardBody>
              <FormGroup row>
                <Label for="date" sm={4}>
                  Date
                </Label>
                <Col sm={4}>
                  <input
                    type="date"
                    value={selectedDate}
                    className="form-control"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </Col>
                <Col sm={3} className="text-end">
                  <Button onClick={generateVoucher}>Create Voucher</Button>
                </Col>
              </FormGroup>
            </CardBody>
          </Card>

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
                      Item Wise Sales Records
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
                    <i className="ri-list-unordered d-inline-block d-md-none text-black"></i>
                    <span
                      className="d-none d-md-inline-block"
                      style={{ color: "black" }}
                    >
                      Item Wise Purchase Records
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
                    <span
                      className="d-none d-md-inline-block"
                      style={{ color: "black" }}
                    >
                      Customer Wise Sales Records
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
                    <span
                      className="d-none d-md-inline-block"
                      style={{ color: "black" }}
                    >
                      Vendor Wise Purchase Records
                    </span>
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>
          <TabContent activeTab={activeTab} className="pt-4 text-muted">
            <TabPane tabId="1">
              {/* Advance Records */}
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <h5
                      className="card-title flex-grow-1 mb-0"
                      style={{ color: "black" }}
                    >
                      Item Wise Sales Records
                    </h5>
                  </div>
                  <Row>
                    <Col lg={12}>
                      <div className="table-responsive">
                        <Table className="table-borderless align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>SN</th>
                              <th>Product</th>
                              <th>Ref. No</th>
                              <th>Rate</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              <th>Net Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.itemWiseSalesRecords &&
                            reportData.itemWiseSalesRecords.length > 0 ? (
                              reportData.itemWiseSalesRecords.map(
                                (record, index) => (
                                  <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{record.productName}</td>
                                    <td>{record.ref_No}</td>
                                    <td className="text-end">
                                      <NumberWithCommas number={record.rate} />
                                    </td>
                                    <td className="text-end">
                                      <NumberWithCommas
                                        number={record.quantity}
                                      />
                                    </td>
                                    <td>{record.unit}</td>
                                    <td className="text-end">
                                      <NumberWithCommas
                                        number={record.net_Amt}
                                      />
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan="7">No data available</td>
                              </tr>
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
                        Item Wise Purchase Records
                      </h5>
                    </div>
                    <Row>
                      <Col lg={12}>
                        <div className="table-responsive">
                          <Table className="table-borderless align-middle mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>SN</th>
                                <th>Product</th>
                                <th>Ref. No</th>
                                <th>Rate</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Net Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.itemWisePurchaseRecords &&
                              reportData.itemWisePurchaseRecords.length > 0 ? (
                                reportData.itemWisePurchaseRecords.map(
                                  (record, index) => (
                                    <tr key={record.id}>
                                      <td>{index + 1}</td>
                                      <td>{record.productName}</td>
                                      <td>{record.ref_No}</td>
                                      <td className="text-end">
                                        <NumberWithCommas
                                          number={record.rate}
                                        />
                                      </td>
                                      <td className="text-end">
                                        <NumberWithCommas
                                          number={record.quantity}
                                        />
                                      </td>
                                      <td>{record.unit}</td>
                                      <td className="text-end">
                                        <NumberWithCommas
                                          number={record.net_Amt}
                                        />
                                      </td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan="7">No data available</td>
                                </tr>
                              )}
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
                      Customer Wise Sales Records
                    </h5>
                  </div>
                  <Row>
                    <Col lg={12}>
                      <div className="table-responsive">
                        <Table className="table-borderless align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>SN</th>
                              <th>Customer</th>
                              <th>Bill No</th>
                              <th>Total Amount</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.customerWiseSalesRecords &&
                            reportData.customerWiseSalesRecords.length > 0 ? (
                              reportData.customerWiseSalesRecords.map(
                                (record, index) => (
                                  <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{record.customerName}</td>
                                    <td>{record.bill_No}</td>
                                    <td className="text-end">
                                      <NumberWithCommas
                                        number={record.total_Amt}
                                      />
                                    </td>
                                    <td>{record.remarks}</td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan="5">No data available</td>
                              </tr>
                            )}
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
                      Vendor Wise Sales Records
                    </h5>
                  </div>
                  <Row>
                    <Col lg={12}>
                      <div className="table-responsive">
                        <Table className="table-borderless align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>SN</th>
                              <th>Vendor</th>
                              <th>Bill No</th>
                              <th>Total Amount</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.vendorWisePurchaseRecords &&
                            reportData.vendorWisePurchaseRecords.length > 0 ? (
                              reportData.vendorWisePurchaseRecords.map(
                                (record, index) => (
                                  <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{record.vendorName}</td>
                                    <td>{record.bill_No}</td>
                                    <td>{record.total_Amt}</td>
                                    <td>{record.remarks}</td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan="5">No data available</td>
                              </tr>
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
        </Row>
      </Container>
    </div>
  );
};

export default InventoryDayBook;
