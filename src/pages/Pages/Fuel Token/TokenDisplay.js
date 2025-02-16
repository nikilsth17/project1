import React from "react";
import { useState, useEffect } from "react";
import FuelTokenServices from "../../../services/HRService/FuelTokenServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Row,
  Col,
  Container,
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
} from "reactstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import CreateButton from "../Starter/CreateButton";
import NumberWithCommas from "../Starter/NumberWithCommas";

function TokenDisplay() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [fuelTokenDisplay, setFuelTokenDisplay] = useState({});

  const [loading, setLoading] = useState(true);

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedItem = await FuelTokenServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedItem);

      // Update the state to display the details of the selected item
      setFuelTokenDisplay(fetchedItem);
      setLoading(false); // Set loading to false after a successful fetch
    } catch (error) {
      console.error("Error viewing item:", error);
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    viewItem(id);
  }, [id]);

  return (
    <div>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb title="Fuel Token Detail " pageTitle="Fuel Token" />
          <Container fluid>
            <CreateButton to="/Fuel_Token-list" text="  Back to List" />

            <Row>
              <Col lg={6}>
                <div className="table-responsive justify align-center">
                  <Card>
                    <CardBody>
                      <Table bordered>
                        <tbody>
                          {/* <tr>
                            <th className="ps-5" scope="row">
                              ID:
                            </th>
                            <td className="text-muted">{fuelTokenDisplay.id}</td>
                          </tr> */}
                          <tr>
                            <th className="ps-5" scope="row">
                              Reference.No:
                            </th>
                            <td className="text-muted">
                              {fuelTokenDisplay?.ref_No}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                              Driver:
                            </th>
                            <td className="text-muted">
                              {fuelTokenDisplay.driverName}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                              Vehicle No:
                            </th>
                            <td className="text-muted">
                              {fuelTokenDisplay.vehicleNo}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                              Fuel:
                            </th>
                            <td className="text-muted">
                              {fuelTokenDisplay.fuelType}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                              Pump:
                            </th>
                            <td className="text-muted">
                              {fuelTokenDisplay.pumpName}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                              Issued:
                            </th>
                            <td className="text-muted">
                              {fuelTokenDisplay.issued_By}{" "}
                              {fuelTokenDisplay.issued_Date}{" "}
                              {fuelTokenDisplay.issued_Time}
                            </td>
                          </tr>
                          {/* <tr>
                          <th className="ps-5" scope="row">
                            Issued Date:
                          </th>
                          <td className="text-muted">
                            {fuelTokenDisplay.issued_Date}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Issued Time:
                          </th>
                          <td className="text-muted">
                            {fuelTokenDisplay.issued_Time}
                          </td>
                        </tr> */}
                          <tr>
                            <th className="ps-5" scope="row">
                              Quantity:
                            </th>
                            <td className="text-muted">
                              {fuelTokenDisplay.quantity}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                              Remarks:
                            </th>
                            <td className="text-muted">
                              {fuelTokenDisplay.remarks}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <th className="ps-5" scope="row">
                            Issued Date:
                          </th>
                          <td className="text-muted">
                            {fuelTokenDisplay.issued_Date}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Issued Time:
                          </th>
                          <td className="text-muted">
                            {fuelTokenDisplay.issued_Time}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Quantity:
                          </th>
                          <td className="text-muted">
                            {fuelTokenDisplay.quantity}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Remarks:
                          </th>
                          <td className="text-muted">
                            {fuelTokenDisplay.remarks}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    </div>
  );
}

export default TokenDisplay;
