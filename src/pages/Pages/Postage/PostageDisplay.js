import React, { useState } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  CardTitle,
  Button,
  Table,
} from "reactstrap";
import LayoutForCRUDListingPage from "../Starter/LayoutForCRUDListingPage";
import PostageList from "./PostageList";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const PostageDisplay = (props) => {
  const [activeTab, setActiveTab] = useState("vouchers");
  const { fromPostalCode, toPostalCode } = useParams(); // Split the combined values
  console.log(fromPostalCode);
  console.log(toPostalCode);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPosts(fromPostalCode, toPostalCode);
  }, [fromPostalCode, toPostalCode]);

  const fetchPosts = async (fromPostalCode, toPostalCode) => {
    try {
      const response = await axios.get(
        `http://api.parcelcalculator.sebs.asia/api/DeliveryCatalogue/services?FromPostalCode=${fromPostalCode}&ToPostalCode=${toPostalCode}`
      );
      console.log(response);
      setData(response); // Assuming the response is an array of data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <LayoutForCRUDListingPage>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === "vouchers" ? "active" : ""}
              onClick={() => toggleTab("vouchers")}
            >
              Parcel
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="vouchers">
            {/* <PostageList fromPostalCode={fromPostalCode} toPostalCode={toPostalCode} /> */}
            <Card>
              <CardBody>
                <Row>
                  <Col sm="12">
                    <Table>
                      <tbody>
                        {data.map((item, index) => (
                          <tr key={index}>
                            <Card>
                              <CardBody>
                                <div className="p-2">
                                  <h3 className="text-black mb-1">
                                    {item.name}
                                  </h3>
                                  <p className="text-opacity-95 text-success">
                                    {item.code}
                                  </p>
                                  <div className="hstack text-black-50 gap-1">
                                    <div className="me-2">
                                      <i className="ri-map-pin-user-line me-1 text-primary text-opacity-75 fs-16 align-middle"></i>
                                      {item.price}
                                    </div>
                                    <div>
                                      <i className="ri-building-line me-1 text-primary text-opacity-75 fs-16 align-bottom"></i>
                                      {item.max_extra_cover}
                                    </div>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>

                            {/* <td>{item.code}</td>
    <td>{item.name}</td>
    <td>{item.price}</td>
    <td>{item.max_extra_cover}</td> */}
                            {/* Add other table data here */}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>
      </LayoutForCRUDListingPage>
    </React.Fragment>
  );
};

export default PostageDisplay;
