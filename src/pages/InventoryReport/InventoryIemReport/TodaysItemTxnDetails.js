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
  Label,
  FormGroup,
  Container,
} from "reactstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ProductsServices from "../../../services/Inventory Services/ProductsServices";
import ItemWiseTReportServices from "../../../services/Inventory Services/ItemWiseTReportServices";

const TodaysItemTxnDetails = () => {
  const { Item_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [productID, setProductID] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [reportData, setReportData] = useState({ Item_id: 0 });

  async function fetchitemPosts(Item_id) {
    console.log(Item_id);
    try {
      const response = await ItemWiseTReportServices.TodaysItemTxnDetail(
        Item_id
      );

      console.log(response);
      setReportData(response);
    } catch (error) {
      console.error("Error fetching ledger details:", error);
    }
  }

  // Function to get product list
  async function fetchProduct() {
    try {
      const fetchedProduct = await ProductsServices.getList();
      console.log("Fetched Products:", fetchedProduct);
      setSelectedProduct(fetchedProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchProduct();
    setSelectedDate(getTodayDate());
  }, []);

  const generateReport = () => {
    fetchitemPosts(productID, selectedDate);
  };
  return (
    <div className="page-content">
      <React.Fragment>
        <BreadCrumb
          title="Todays Transaction Report"
          pageTitle="Todays Report "
        />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  {/* <CardHeader>
             <CreateButton to='/itemwiseT_report/details/${id}' text='+ Details'  />
    
              </CardHeader> */}
                  <Row>
                    <FormGroup row>
                      <Col sm={3}>
                        <Label for="productID">Product:</Label>
                      </Col>
                      <Col sm={3}>
                        <select
                          value={productID}
                          className="form-control"
                          onChange={(e) => setProductID(e.target.value)}
                        >
                          <option value="">Select Product</option>
                          {selectedProduct.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col sm={3}>
                        <Label for="date" sm={2}>
                          Date
                        </Label>
                      </Col>
                      <Col sm={3}>
                        <input
                          type="date"
                          value={selectedDate}
                          className="form-control"
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </Col>
                    </FormGroup>
                    <Col sm={3}>
                      <Label sm={2}></Label>
                    </Col>
                    <Col sm={3}>
                      <Button color="primary" onClick={generateReport}>
                        <div> Generate Report</div>
                      </Button>
                    </Col>
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
                              S.N
                            </th>
                            <th className="sort" data-sort="sn">
                              Type
                            </th>
                            <th className="sort" data-sort="txnDate">
                              Transaction Date
                            </th>
                            <th className="sort" data-sort="bill_No">
                              Reference No.
                            </th>
                            <th className="sort" data-sort="total_Amt">
                              Rate
                            </th>
                            <th className="sort" data-sort="remarks">
                              Quantity
                            </th>
                            <th className="sort" data-sort="action">
                              Unit
                            </th>
                            <th className="sort" data-sort="action">
                              Net Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.length > 0 ? (
                            reportData.map((transaction, index) => (
                              <tr key={transaction.id}>
                                <td>{index + 1}</td>
                                <td className="type">
                                  <span
                                    className={`badge ${
                                      transaction.type === "Sale"
                                        ? "bg-danger"
                                        : "bg-success"
                                    }-subtle text-uppercase text-dark`}
                                  >
                                    {transaction.type}
                                  </span>
                                </td>
                                <td>{transaction.txnDate}</td>
                                <td className="text-end">
                                <NumberWithCommas
                                          number={transaction.ref_No}
                                        />
                                  </td>
                                <td className="text-end">
                                <NumberWithCommas
                                          number=   {transaction.rate}
                                        />
                               </td>
                                <td className="text-end">
                                <NumberWithCommas
                                          number=  {transaction.quantity}
                                        />
                                 </td>
                                <td >{transaction.unit}</td>
                                <td className="text-end">
                                <NumberWithCommas
                                          number=   {transaction.net_Amt}
                                        />
                                 </td>
                                <td></td>
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

export default TodaysItemTxnDetails;
