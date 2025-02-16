import React from "react";
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
import { useState, useEffect } from "react";
import SalesServices from "../../../services/Inventory Services/SalesServices";
import CreateButton from "../../Pages/Starter/CreateButton";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
const defData = {
  id: 2,
  date: "2023-10-05T10:30:41.564",
  customerId: 3,
  invoice_No: "strfding",
  remarks: "strcving",
  sub_Total: 0,
  disc_Amt: 0.0,
  total: 0.0,
  vaT_Per: 0,
  vaT_Amt: 0.0,
  net_Amt: 0.0,
  vmSaleItem: [
    {
      id: 2,
      productID: 8,
      quantity: 0,
      unitID: 35,
      rate: 0.0,
      sub_Total: 0,
      disc_Amt: 0.0,
      net_Amt: 0,
    },
  ],
};

const SaleDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState(defData);

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedItem = await SalesServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedItem);

      // Update the state to display the details of the selected item
      setCustomerDetail(fetchedItem);
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
      <BreadCrumb title="Sale Details" pageTitle="Sale" />
      <Card>
        <CardHeader>
      
      <div className="d-flex justify-content-end">
  <Button
    className="btn btn-soft-success mb-3 text-start"
    onClick={() => navigate(`/sales`)}
  >
    Back to List
  </Button>
</div>
</CardHeader>
<CardBody>
  <CardHeader>
<Col lg={12}>
                    <CardBody className="p-4">
                      <Row className="g-3">
                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">  Date</p>
                          <h5 className="fs-15 mb-0"><span id="invoice-no">      {customerDetail?.date
                                  .split("T")[0]
                                  .replace(
                                    /(\d{4})-(\d{2})-(\d{2})/,
                                    "$1-$2-$3"
                                  )
                                  .substring(0, 10)}</span></h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13"> Customer</p>
                          <h5 className="fs-15 mb-0"><span id="invoice-date">     {customerDetail.customerName}</span> <small className="text-muted" id="invoice-time"></small></h5>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">   Invoice No</p>
                          <span className="badge bg-success-subtle text-success fs-11" id="payment-status">     {customerDetail?.invoice_No}</span>
                        </Col>

                        <Col lg={3} className="col-6">
                          <p className="text-muted mb-2 text-uppercase fw-semibold fs-13">  Remarks</p>
                          <h5 className="fs-15 mb-0">$<span id="total-amount"> {customerDetail?.remarks}</span></h5>
                        </Col>

                      </Row>

                    </CardBody>

                  </Col>
</CardHeader>
        <Container fluid>
          
                <Row>
                  <Col lg={12}>
                   
                        
                        <div className="table-responsive ">
                          <Table stripped-bordered>
                            <thead className="bg-light">
                              <tr>
                                <th >S.N</th>
                                <th >Product</th>
                                <th >Quantity</th>
                                <th >Unit</th>
                                <th >Rate</th>
                                <th >Sub Total</th>
                                <th >Disc Amt</th>
                                <th >Net Amt</th>
                                <th >Driver Name</th>
                                <th >Vechile Number</th>
                                <th >destination</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customerDetail.vmSaleItemDetails && Array.isArray(customerDetail.vmSaleItemDetails) ? (
                                customerDetail.vmSaleItemDetails.map((customer, index) => (
                                  <tr key={customer.id}>
                                    <td>{index + 1}</td>

                                    <td >
                                      <Link to={`/product/details//${customer.productID}`}>
                                        {customer.productName}
                                      </Link>
                                    </td>
                                    <td>{customer.quantity}</td>
                                    <td><Link to={`/product-unit/details/${customer.unitID}`}>
                                      {customer.unitName}
                                    </Link></td>
                                    <td>
                                    <NumberWithCommas
                                number={customer.rate} />
                                </td>
                                    <td>
                                    <NumberWithCommas
                                number={customer.sub_Total} />
                                </td>
                                    <td>
                                    <NumberWithCommas
                                number={customer.disc_Amt} />
                                </td>
                                    <td>
                                    <NumberWithCommas
                                number={customer.net_Amt} />
                                </td>
                               
                                    <td>{customer.driver_Name}
                                      {/* <Link to={`/employee-form/details/${customer.driver_Name}`}>
    {customer.driver_Name}</Link> */}
                                    </td>
                                    <td>{customer.vechile_Number}
                                      {/* <Link to={`/vehicle-form/details/${customer.vechile_Number}`}>
    {customer.vechile_Number}</Link> */}
                                    </td>
                                    <td>{customer.destination}
                                      {/* <Link to={`/vehicle-form/details/${customer.vechile_Number}`}>
    {customer.vechile_Number}</Link> */}
                                    </td>
                                    
                                  </tr>
                                ))
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
                        </Row>
                        <table className="table table-borderless table-nowrap align-middle mb-0 ms-auto" style={{ width: "250px" }}>
      <tbody>
        <tr>
          <td>Sub Total:</td>
          <td className="text-end">
            <NumberWithCommas number={customerDetail?.sub_Total} />
          </td>
        </tr>
        <tr>
          <td>Discount Amount:</td>
          <td className="text-end">
            <NumberWithCommas number={customerDetail?.disc_Amt} />
          </td>
        </tr>
        <tr>
          <td>Total:</td>
          <td className="text-end">
            <NumberWithCommas number={customerDetail?.total} />
          </td>
        </tr>
        <tr>
          <td>Vat Percentage:</td>
          <td className="text-end">
            {customerDetail?.vaT_Per}
          </td>
        </tr>
        <tr>
          <td>Vat Amount:</td>
          <td className="text-end">
            {customerDetail?.vaT_Amt}
          </td>
        </tr>
        <tr>
          <td>Net Amount:</td>
          <td className="text-end">
            <NumberWithCommas number={customerDetail?.net_Amt} />
          </td>
        </tr>
      </tbody>
    </table>
                        </Container>
                        </CardBody>
                        </Card>
                        </div>
                        </React.Fragment>
       
  );
};

export default SaleDisplay;
