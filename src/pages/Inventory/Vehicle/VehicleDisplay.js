import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Progress,
} from "reactstrap";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Navigate } from "react-router-dom";
import VehicleServices from "../../../services/Inventory Services/VehicleServices";
import CreateButton from "../../Pages/Starter/CreateButton";

const VehicleDisplay = () => {
  const { id } = useParams();
  const idValue = id || 0;

  // Initialize vehicleDetails as an empty object
  const [vehicleDetails, setVehicleDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Define an async function to fetch employee details using the 'view' API call
    async function fetchVehicalData() {
      try {
        // Use the 'id' parameter in the API call
        const response = await VehicleServices.view(idValue);

        // Update the state with the fetched data
        setVehicleDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

    // Call the async function to fetch employee details
    fetchVehicalData();
  }, [id, idValue]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Vehicle Detail" pageTitle="Vehicle R" />
        <Container fluid>
          <CreateButton to="/vehicle-list" text="  Back to List" />

          <Row>
            <Col lg={2}></Col>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        {/* <tr>
                        <th className="ps-5" scope="row">
                          ID:
                        </th>
                        <td className="text-muted">{vehicleDetails.id}</td>
                      </tr> */}
                        <tr>
                          {/* <th className="ps-5" scope="row">
                            VehicleTypeId:
                            </th>
                            <td className="text-muted">
                              {vehicleDetails.vehicleTypeId}
                            </td> */}
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Vehicle:
                          </th>
                          <td className="text-muted">
                            {vehicleDetails.vehicleType}
                          </td>
                        </tr>
                        <tr>
                          {/* <th className="ps-5" scope="row">
                            FuelTypeId:
                            </th>
                            <td className="text-muted">
                              {vehicleDetails.fuelTypeId}
                            </td> */}
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Fuel:
                          </th>
                          <td className="text-muted">
                            {vehicleDetails.fuelType}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Vehicle No:
                          </th>
                          <td className="text-muted">
                            {vehicleDetails.vehicle_No}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Vehicle Model:
                          </th>
                          <td className="text-muted">
                            {vehicleDetails.vehicle_Model}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VehicleDisplay;
