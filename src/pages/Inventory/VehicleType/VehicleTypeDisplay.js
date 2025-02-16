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

import VechicleTypeService from "../../../services/Inventory Services/VehicleTypeServices";
import CreateButton from "../../Pages/Starter/CreateButton";

const VehicleTypeDisplay = () => {
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
        const response = await VechicleTypeService.view(idValue);

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
        <BreadCrumb title="Vehicle Type  Detail" pageTitle="Vehicle Type " />

        <Container fluid>
          <CreateButton to="/vehicletype-list" text="  Back to List" />
          <Row>
            <Col lg={2}></Col>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <Table bordered>
                      <tbody>
                        {/* <tr>
                        <th className="ps-5" scope="row">
                          ID:
                        </th>
                        <td className="text-muted">{vehicleDetails.id}</td>
                      </tr> */}
                        <tr>
                          <th className="ps-5" scope="row">
                            Vehicle Type:
                          </th>
                          <td className="text-muted">{vehicleDetails.title}</td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Description:
                          </th>
                          <td className="text-muted">
                            {vehicleDetails.description}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
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

export default VehicleTypeDisplay;
