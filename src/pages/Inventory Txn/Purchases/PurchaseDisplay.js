import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
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
} from "reactstrap";
import React, { useState, useEffect } from "react";
import PurchasesServices from "../../../services/Inventory Services/PurchasesServices";
import CreateButton from "../../Pages/Starter/CreateButton";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
const defData = {
  id: 0,
  date: "2023-10-08T17:25:15.340Z",
  vendorId: 0,
  invoice_No: "string",
  remarks: "string",
  sub_Total: 0,
  disc_Amt: 0,
  additional_Disc_Amt: 0,
  total: 0,
  vaT_Per: 0,
  vaT_Amt: 0,
  net_Amt: 0,
  vmPurchaseItemDetails: [
    {
      id: 0,
      productID: 0,
      quantity: 0,
      unitID: 0,
      rate: 0,
      amount: 0,
      mgf_Date: "2023-10-08T17:25:15.340Z",
      exp_Date: "2023-10-08T17:25:15.340Z",
      batch_No: "string",
      disc_Amt: 0,
      net_Amt: 0,
    },
  ],
};

const PurchaseDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchaseDetail, setuPrchaseDetail] = useState(defData);

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedItem = await PurchasesServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedItem);

      // Update the state to display the details of the selected item
      setuPrchaseDetail(fetchedItem);
      // Set loading to false after a successful fetch
    } catch (error) {
      console.error("Error viewing item:", error);
      // Set loading to false on error
    }
  };

  useEffect(() => {
    // Fetch the item details when the component mounts based on the id from the URL
    console.log("Fetching data for id:", id);
    viewItem(id);
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Purchase Details" pageTitle="Purchase" />
        <Card>
          <CardHeader>
        <CreateButton to="/purchases" text="  Back to List" />
        </CardHeader>
        <CardBody>
        <Container fluid>
        <CardHeader>
<Col lg={12}>
                    <CardBody className="p-4">
                      <Row className="g-3">
                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">  Date</p>
                          <h5 className="fs-15 mb-0"><span id="invoice-no">{purchaseDetail?.date
                                  .split("T")[0]
                                  .replace(
                                    /(\d{4})-(\d{2})-(\d{2})/,
                                    "$1-$2-$3"
                                  )
                                  .substring(0, 10)}</span></h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13"> Customer</p>
                          <h5 className="fs-15 mb-0"><span id="invoice-date">  <Link
                                  to={`/vendor/details/${purchaseDetail?.vendorId}`}
                                >
                                  {purchaseDetail?.vendorName}
                                </Link></span> <small className="text-muted" id="invoice-time"></small></h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">   Invoice No</p>
                          <span className="badge bg-success-subtle text-success fs-11" id="payment-status">  
                                {purchaseDetail?.invoice_No}</span>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">  Remarks</p>
                          <h5 className="fs-15 mb-0"><span id="total-amount">    {purchaseDetail?.remarks}</span></h5>
                        </Col>

                      </Row>

                    </CardBody>

                  </Col>
</CardHeader>
          <Row>
            <Col lg={12}>
              <div className="table-responsive">
                <Row>
                  <Col lg={12}>
  
                        <div className="table-responsive">
                          <Table>
                            <thead className="ml-0 bg-light">
                              <tr>
                                <th>S.N</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Rate</th>
                                <th>Amount</th>
                                <th>Mfg Date</th>
                                <th>Exp Date</th>
                                <th>Batch No.</th>
                                <th>Disc. Amount</th>
                                <th>Net Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {purchaseDetail.vmPurchaseItemDetails &&
                              Array.isArray(
                                purchaseDetail.vmPurchaseItemDetails
                              ) ? (
                                purchaseDetail.vmPurchaseItemDetails.map(
                                  (purchase, index) => (
                                    <tr key={purchase.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <Link
                                          to={`/vendor/details/${purchase.productID}`}
                                        >
                                          {purchase.productName}
                                        </Link>
                                      </td>
                                      <td className="text-end">
                                      <NumberWithCommas
                                number={purchase.quantity} />
                                      </td>
                                      <td>
                                        <Link
                                          to={`/vendor/details/${purchase.unitID}`}
                                        >
                                          {purchase.unitName}
                                        </Link>
                                      </td>
                                      <td className="text-end">
                                      <NumberWithCommas
                                number= {purchase.rate} />
                                      </td>
                                      <td className="text-end">
                                      <NumberWithCommas
                                number= {purchase.amount} />
                                      </td>
                                      <td>
                                        {purchase.mgf_Date
                                          ? purchase.mgf_Date.split("T")[0]
                                          : ""}
                                      </td>

                                      <td>
                                        {purchase.exp_Date
                                          ? purchase.exp_Date.split("T")[0]
                                          : ""}
                                      </td>

                                      <td className="text-end">
                                        {purchase.batch_No}
                                      </td>
                                      <td className="text-end">
                                      <NumberWithCommas
                                number= {purchase.disc_Amt} />
                                      </td>
                                      <td className="text-end">
                                      <NumberWithCommas
                                number= {purchase.net_Amt} />
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
                     
                  </Col>
                  <Row>
                                         
<table className="table table-borderless table-nowrap align-middle mb-0 ms-auto" style={{ width: "250px" }}>
      <tbody>
        <tr>
          <td>Sub Total:</td>
          <td className="text-end">
            <NumberWithCommas number={purchaseDetail?.sub_Total} />
          </td>
        </tr>
        <tr>
          <td>Discount Amount:</td>
          <td className="text-end">
            <NumberWithCommas number={purchaseDetail?.disc_Amt} />
          </td>
        </tr>
        <tr>
          <td>Total:</td>
          <td className="text-end">
            <NumberWithCommas number={purchaseDetail?.total} />
          </td>
        </tr>
        <tr>
          <td>Vat Percentage:</td>
          <td className="text-end">
             {purchaseDetail?.vaT_Per}
          </td>
        </tr>
        <tr>
          <td>Vat Amount:</td>
          <td className="text-end">
             {purchaseDetail?.vaT_Amt}
          </td>
        </tr>
        <tr>
          <td>Net Amount:</td>
          <td className="text-end">
            <NumberWithCommas number={purchaseDetail?.net_Amt} />
          </td>
        </tr>
      </tbody>
    </table>
                       
                        </Row>
                        </Row>
                        </div>
                        </Col>
                        </Row>
                        </Container>
                        </CardBody>
                        </Card>
                        </div>
                        </React.Fragment>
  );
};

export default PurchaseDisplay;
