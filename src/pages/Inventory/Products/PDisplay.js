import React, { useState, useEffect } from "react";
import { Col, Label, Row } from "reactstrap";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Input,
  Button,
} from "reactstrap";
import { useParams, Link, useNavigate } from "react-router-dom"; // Import useParams
import ProductsServices from "../../../services/Inventory Services/ProductsServices";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CreateButton from "../../Pages/Starter/CreateButton";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";

const PDisplay = (props) => {
  const { id } = useParams(); // Get the 'id' from URL params
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedItem = await ProductsServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedItem);

      // Update the state to display the details of the selected item
      setItem(fetchedItem);
      setLoading(false); // Set loading to false after a successful fetch
    } catch (error) {
      console.error("Error viewing item:", error);
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    viewItem(id);
  }, [id]);

  // Add a function to handle closing
  const handleClose = () => {
    // Implement your close logic here
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Product Detail" pageTitle="Product " />

        <CreateButton to="/product" text="  Back to List" />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <div className="table-responsive">
                <Row>
                  <Col lg={6}>
                    <Card>
                      <CardBody>
                        <p>Product Details</p>

                        <table className="table table-bordered">
                          <tbody>
                            {/* <tr>
                              <th className="ps-5" scope="row">
                                Code:
                              </th>
                              <td className="text-muted">{item?.code}</td>
                            </tr> */}
                            <tr>
                              <th className="ps-5" scope="row">
                                Product:
                              </th>
                              <td className="transaction_Date">{item?.name}</td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Category:
                              </th>
                              <td className="text-muted">
                                {item?.categoryName}
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Description:
                              </th>
                              <td className="text-muted">
                                {item?.description}
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Unit:
                              </th>
                              <td className="text-muted">{item?.unitName}</td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Cost price
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number={item?.last_CP}/>
                                  </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Selling Price
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number={item?.last_SP}/>
                                  </td>
                            </tr>
                          </tbody>
                        </table>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={6}>
                    <Card>
                      <CardBody>
                        <p>Extra Details</p>
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <th className="ps-5" scope="row">
                                Opening Quantity
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number={item?.opening_Qty}
                                  />
                              </td>
                            </tr>
                            {/* <tr>
                              <th className="ps-5" scope="row">
                                Ledger Code:
                              </th>
                              <td className="text-muted">
                                {item?.ledger_Code}
                              </td>
                            </tr> */}
                            <tr>
                              <th className="ps-5" scope="row">
                                Status:
                              </th>
                              <td className="text-muted">
                                {item?.status ? "Active" : "Inactive"}
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Stock:
                              </th>
                              <td className="text-muted">
                                {item?.enable_Stock ? "True" : "False"}
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Taxable:
                              </th>
                              <td className="text-muted">
                                {item?.is_Taxable ? "Yes" : "No"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PDisplay;
