import React from "react";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate, useParams, Link } from "react-router-dom";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
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
import CreateButton from "../../Pages/Starter/CreateButton";
import ItemWiseTReportServices from "../../../services/Inventory Services/ItemWiseTReportServices";

const VendorSDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendorDetails, setVendorDetails] = useState([]);

  // Function to view item details

  async function fetchitemPosts(Item_id) {
    console.log(id);
    try {
      const response = await ItemWiseTReportServices.VendorStatementDetail(
        Item_id
      );

      console.log(response);
      setVendorDetails(response);
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
        <BreadCrumb title="Vendor Summary Detail" pageTitle="Vendor" />
        <Card>
          <CardHeader>
        <CreateButton to="/vendosummary_report" text="  Back to List" />
        </CardHeader>
        <CardBody>
        <Container fluid>
        <CardHeader>
<Col lg={12}>
                    <CardBody className="p-4">
                      <Row className="g-3">
                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13"> Vendor</p>
                          <h5 className="fs-15 mb-0"><span id="invoice-no">{vendorDetails.vendorName}</span>
                              </h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13"> Transction Date</p>
                          <h5 className="fs-15 mb-0"><span id="invoice-date">  {vendorDetails._txnDate}</span> <small className="text-muted" id="invoice-time"></small></h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">  Bill No</p>
                          <span className="badge bg-success-subtle text-success fs-11" id="payment-status"> {vendorDetails.bill_No}</span>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">  Remarks</p>
                          <h5 className="fs-15 mb-0"><span id="total-amount">{vendorDetails.remarks}</span></h5>
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

                                <th>Product</th>
                                <th>Unit</th>
                                <th>Rate</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <td>Batch.No</td>
                                <th>Disc.Amt</th>
                                <th>Net.Amt</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vendorDetails.vmVendorStatementDetail &&
                              Array.isArray(
                                vendorDetails.vmVendorStatementDetail
                              ) ? (
                                vendorDetails.vmVendorStatementDetail.map(
                                  (vendor, index) => (
                                    <tr key={vendor.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <Link
                                          to={`/product/details/${vendor.productID}`}
                                        >
                                          {vendor.productName}
                                        </Link>
                                      </td>
                                      <td>
                                        <Link
                                          to={`/product-unit/details/${vendor.unitID}`}
                                        >
                                          {vendor.unitName}
                                        </Link>
                                      </td>
                                      <td>
                                      <NumberWithCommas
                                        number={vendor.rate} />
                                        </td>
                                      <td>
                                      <NumberWithCommas
                                        number={vendor.quantity}/>
                                        </td>
                                      <td>
                                      <NumberWithCommas
                                        number={vendor.sub_Total} />
                                        </td>
                                      <td> {vendor.batch_No}</td>
                                      <td>
                                      <NumberWithCommas
                                        number={vendor.disc_Amt} />
                                        </td>
                                      <td>
                                      <NumberWithCommas
                                        number={vendor.net_Amt} />
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
                            </tbody>{" "}
                          </Table>
                       </div>
                       </Container>
                       </CardBody>
                       </Card>
                       </div>
                       </React.Fragment>
  );
};

export default VendorSDetail;
