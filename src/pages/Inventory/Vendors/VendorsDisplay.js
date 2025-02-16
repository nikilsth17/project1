import React, { useState, useEffect } from "react";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Label,
  NavItem,
  NavLink,
  Nav,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import VendorsServices from "../../../services/Inventory Services/VendorServices";
import CreateButton from "../../Pages/Starter/CreateButton";
const VendorsDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendorDetail, setVendorDetail] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [activityTab, setActivityTab] = useState("1");

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedVendors = await VendorsServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedVendors);

      // Update the state to display the details of the selected item
      setVendorDetail(fetchedVendors);
      // Set loading to false after a successful fetch
    } catch (error) {
      console.error("Error viewing item:", error);
      // Set loading to false on error
    }
  };

  useEffect(() => {
    // Fetch the item details when the component mounts based on the id from the URL
    viewItem(id);
  }, [id]);

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
        <BreadCrumb title="Vendor Detail " pageTitle="Vendor" />
        <Container fluid>
          <Row>
            <Col>
              <div className="pd-6 px-10 md-9" style={{ display: "flex" }}>
                <Nav
                  pills
                  className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                  role="tablist"
                >
                  <CreateButton to="/vendor" text="  Back to List" />
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
                        AdvanceRecords
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
                      <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                      <span className="d-none d-md-inline-block">
                        AdvanceRecords
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
                      <i className="ri-airplay-fill d-inline-block d-md-none"></i>{" "}
                      <span className="d-none d-md-inline-block">
                        AdvanceRecords
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={2}></Col>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th className="ps-5" scope="row">
                            Name:
                          </th>
                          <td className="text-muted">{vendorDetail?.name}</td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Address:
                          </th>
                          <td className="text-muted">
                            {vendorDetail?.address}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Registration No:
                          </th>
                          <td className="text-muted">
                            {vendorDetail?.registration_No}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Phone No:
                          </th>
                          <td className="text-muted">{vendorDetail?.tel_No}</td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Opening Balance:
                          </th>
                          <td className="text-muted">
                            {vendorDetail?.opening_Balance}
                          </td>
                        </tr>
                        {/* <tr>
                        <th className="ps-5" scope="row">
                          Ledger Code:
                        </th>
                        <td className="text-muted">
                          {" "}
                          {vendorDetail?.ledger_code}
                        </td>
                      </tr> */}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
              {/* 
              <TabPane tabId="1">
                    Advance Records
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
                                  {(vendorDetail.advanceRecords || []).map(
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
                                        <td>{item.amount}</td>
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
                  </TabPane> */}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VendorsDisplay;
