import React, { useState, useEffect } from "react";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Table,
  Button,
  FormGroup,
  Label,
  ButtonGroup,
  Container,
} from "reactstrap";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import CustomerStatement from "../../../services/Inventory Services/CustomerStatement";
import CustomerServices from "../../../services/Inventory Services/CustomerServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";

const CustomerStatemenSummary = () => {
  const location = useLocation();
  // const selectedCustomerID = location.state.selectedCustomerID;
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState({ Item_id: 0 });
  const [customerID, setCustomerID] = useState([]);

  const [dataC, setDataC] = useState("");

  // Function to view item details

  async function fetchitemPosts(Item_id) {
    console.log(id);
    try {
      const response = await CustomerStatement.getList(Item_id);

      console.log(response);
      setCustomerDetail(response);
    } catch (error) {
      console.error("Error fetching ledger details:", error);
    }
  }

  // Function to get product list
  async function fetchCustomer() {
    console.log(id);
    try {
      const fetchedCustomer = await CustomerServices.getList();
      console.log("Fetched customer:", fetchedCustomer);
      setCustomerID(fetchedCustomer);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchCustomer();
  }, []);

  const generateReport = () => {
    fetchitemPosts(dataC);
  };

  return (
    <div className="page-content">
      <React.Fragment>
        <BreadCrumb title="Customer Report" pageTitle="Customer " />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <FormGroup row>
                      <Col sm={3}>
                        <Label for="customerID">Customers:</Label>
                      </Col>
                      <Col sm={3}>
                        <select
                          value={dataC}
                          className="form-control"
                          onChange={(e) => setDataC(e.target.value)}
                        >
                          <option value="">Select Customer</option>
                          {customerID.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col sm={3}>
                        <Button color="primary" onClick={generateReport}>
                          Generate Report
                        </Button>
                      </Col>
                    </FormGroup>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div id="customerList">
                    <Row className="g-4 mb-3"></Row>

                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap"
                        id="employeeTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th className="sort" data-sort="sn">
                              SN
                            </th>

                            <th className="sort" data-sort="txnDate">
                              Transaction Date
                            </th>
                            <th className="sort" data-sort="bill_No">
                              Bill Number
                            </th>
                            <th className="sort" data-sort="total_Amt">
                              Total Amount
                            </th>
                            <th className="sort" data-sort="remarks">
                              Remarks
                            </th>
                            <th className="sort" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerDetail.length > 0 ? (
                            customerDetail.map((transaction, index) => (
                              <tr key={transaction.id}>
                                <td>{index + 1}</td>
                                <td>{transaction.txnDate}</td>
                                <td className="text-end">{transaction.bill_No}</td>
                                <td className="text-end">
                                  
                                <NumberWithCommas
                                          number={transaction.total_Amt}
                                        /></td>
                                <td>{transaction.remarks}</td>
                                <ButtonGroup size="sm">
                                  {/* for details button */}

                                  {/* <Button
                                    color="btn btn-soft-success"
                                    style={{ marginRight: "5px" }}
                                  >
                                    <Link
                                      to={`/customer-summary/details/${transaction.id}`}
                                      state={{
                                        selectedCustomerID: transaction.id,
                                      }} // Pass the selected customer ID
                                    >
                                      <i className="bx bx-show" />
                                    </Link>
                                  </Button> */}
                                  <Link
                                    to={`/customer-summary/details/${transaction.id}`}
                                    state={{
                                      selectedCustomerID: transaction.id,
                                    }}
                                  >
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link>
                                </ButtonGroup>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8">No data available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="noresult" style={{ display: "none" }}>
                      <div className="text-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#121331,secondary:#08a88a"
                          style={{ width: "75px", height: "75px" }}
                        ></lord-icon>
                        <h5 className="mt-2">Sorry! No Result Found</h5>
                        <p className="text-muted mb-0">
                          We've searched more than 150+ Orders We did not find
                          any orders for you search.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <div className="pagination-wrap hstack gap-2">
                      <Link
                        className="page-item pagination-prev disabled"
                        to="#"
                      >
                        Previous
                      </Link>
                      <ul className="pagination listjs-pagination mb-0"></ul>
                      <Link className="page-item pagination-next" to="#">
                        Next
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    </div>
  );
};

export default CustomerStatemenSummary;
