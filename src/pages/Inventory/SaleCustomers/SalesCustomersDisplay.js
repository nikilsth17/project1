import React from "react";
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
  ButtonToggle,
  Label,
} from "reactstrap";
import { useState, useEffect } from "react";
import CustomerServices from "../../../services/Inventory Services/CustomerServices";
import CreateButton from "../../Pages/Starter/CreateButton";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";

const SalesCustomersDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState();

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedCustomer = await CustomerServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedCustomer);

      // Update the state to display the details of the selected item
      setCustomerDetail(fetchedCustomer);
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
  return (
    <div>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb title="Customer Detail" pageTitle="Customer " />

          <CreateButton to="/customers" text="  Back to List" />
          <Container fluid>
            <Row>
              <Col lg={12}>
                <div className="table-responsive">
                  <Row>
                    <Col lg={6}>
                      <Card>
                        <CardBody>
                          <p>Customer Details</p>

                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <th className="ps-5" scope="row">
                                  Name:
                                </th>
                                <td className="text-muted">
                                  {customerDetail?.name}
                                </td>
                              </tr>
                              <tr>
                                <th className="ps-5" scope="row">
                                  Address:
                                </th>
                                <td className="transaction_Date">
                                  {customerDetail?.address}
                                </td>
                              </tr>
                              <tr>
                                <th className="ps-5" scope="row">
                                  Phone Number:
                                </th>
                                <td className="text-muted">
                                  {customerDetail?.telePhone_No}
                                </td>
                              </tr>
                              <tr>
                                <th className="ps-5" scope="row">
                                  Opening Balance:
                                </th>
                                <td className="text-muted">
                                <NumberWithCommas 
                                  number={customerDetail?.openingBalance}
                                  />
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
                                  Registration No:
                                </th>
                                <td className="text-muted">
                                  {customerDetail?.registration_No}
                                </td>
                              </tr>
                              <tr>
                                <th className="ps-5" scope="row">
                                  Registration Date:
                                </th>
                                <td className="text-muted">
                                  {customerDetail?.registered_Date}
                                </td>
                              </tr>
                              {/* <tr>
                                <th className="ps-5" scope="row">
                                  Ledger Code:
                                </th>
                                <td className="text-muted">
                                  {customerDetail?.ledger_code}
                                </td>
                              </tr> */}
                              <tr>
                                <th className="ps-5" scope="row">
                                  Status:
                                </th>
                                <td className="text-muted">
                                  {customerDetail?.status
                                    ? "Active"
                                    : "Inactive"}
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
    </div>
  );
};
export default SalesCustomersDisplay;
