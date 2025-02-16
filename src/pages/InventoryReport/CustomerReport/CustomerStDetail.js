import React from "react";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonToggle,
  Label,
  FormGroup,
} from "reactstrap";
import { useState, useEffect } from "react";
import CustomerStatement from "../../../services/Inventory Services/CustomerStatement";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import CreateButton from "../../Pages/Starter/CreateButton";

const CustomerStDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState([]);
  // const [customerID, setCustomerID] = useState([]);

  // const [dataC, setDataC] = useState('');

  // Function to view item details

  async function fetchitemPosts(Item_id) {
    console.log(id);
    try {
      const response = await CustomerStatement.view(Item_id);

      console.log(response);
      setCustomerDetail(response);
    } catch (error) {
      console.error("Error fetching ledger details:", error);
    }
  }

  useEffect(() => {
    // Fetch the item details when the component mounts based on the id from the URL
    console.log("Fetching data for id:", id);
    fetchitemPosts(id);
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Customer Summary Detail" pageTitle="Customer" />
        <Card>
          <CardHeader>
            <CreateButton to="/customer-summary" text="  Back to List" />
          </CardHeader>
          <CardBody>
            <Container fluid>
              <CardHeader>
                <Col lg={12}>
                  <CardBody className="p-4">
                    <Row className="g-3">
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                          Customer
                        </p>
                        <h5 className="fs-15 mb-0">
                          <span id="invoice-no">
                            {customerDetail.customerName}
                          </span>
                        </h5>
                      </Col>

                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                          {" "}
                          Transction Date
                        </p>
                        <h5 className="fs-15 mb-0">
                          <span id="invoice-date">
                            {" "}
                            {customerDetail.txnDate}
                          </span>{" "}
                          <small
                            className="text-muted"
                            id="invoice-time"
                          ></small>
                        </h5>
                      </Col>

                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                          {" "}
                          Bill No
                        </p>
                        <span
                          className="badge bg-success-subtle text-success fs-11"
                          id="payment-status"
                        >
                          {customerDetail.bill_No}
                        </span>
                      </Col>

                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">
                          {" "}
                          Remarks
                        </p>
                        <h5 className="fs-15 mb-0">
                          <span id="total-amount">
                            {" "}
                            {customerDetail.remarks}
                          </span>
                        </h5>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
              </CardHeader>

              <div className="table-responsive">
                <Table>
                  <thead className="ml-0 bg-light">
                    <tr>
                      <th>S.N</th>

                      <th>Product Name</th>
                      <th>Unit Name</th>
                      <th>Rate</th>
                      <th>Quantity</th>
                      <th>Sub Total</th>

                      <th>Disc Amount</th>
                      <th>Net Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerDetail.vmCustomerStatementDetail &&
                    Array.isArray(customerDetail.vmCustomerStatementDetail) ? (
                      customerDetail.vmCustomerStatementDetail.map(
                        (customer, index) => (
                          <tr key={customer.id}>
                            <td>{index + 1}</td>
                            <td>
                              <Link
                                to={`/product/details/${customer.productID}`}
                              >
                                {customer.productName}
                              </Link>
                            </td>
                            <td>
                              <Link
                                to={`/product-unit/details/${customer.unitID}`}
                              >
                                {customer.unitName}
                              </Link>
                            </td>
                            <td>
                              <NumberWithCommas number={customer.rate} />
                            </td>
                            <td>
                              {" "}
                              <NumberWithCommas number={customer.quantity} />
                            </td>
                            <td>
                              {" "}
                              <NumberWithCommas number={customer.sub_Total} />
                            </td>
                            <td>
                              <NumberWithCommas number={customer.disc_Amt} />
                            </td>
                            <td>
                              <NumberWithCommas number={customer.net_Amt} />
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      // Display a loading message when data is not available
                      <tr>
                        <td colSpan="7">Loading...</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Container>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default CustomerStDetail;
