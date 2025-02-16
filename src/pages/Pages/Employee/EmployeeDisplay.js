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
import SwiperCore, { Autoplay } from "swiper";
import "swiper/swiper-bundle.min.css"; // Import Swiper CSS
import EmployeeService from "../../../services/HRService/EmployeeService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

SwiperCore.use([Autoplay]);

const EmployeeDisplay = () => {
  const { id } = useParams();
  const idValue = id || 0;

  // Initialize employeeDetails as an empty object
  const [employeeDetails, setEmployeeDetails] = useState({});

  useEffect(() => {
    // Define an async function to fetch employee details using the 'view' API call
    async function fetchEmployeeDetails() {
      try {
        // Use the 'id' parameter in the API call
        const response = await EmployeeService.view(idValue);

        // Update the state with the fetched data
        setEmployeeDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

    // Call the async function to fetch employee details
    fetchEmployeeDetails();
  }, [id, idValue]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Employee Details" pageTitle="Employee" />
          <Row>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <div className="p-2">
                    <h3 className="text-black mb-1">{employeeDetails.name}</h3>
                    <p className="text-opacity-75 text-primary">
                      {employeeDetails.email}
                    </p>
                    <div className="hstack text-black-50 gap-1">
                      <div className="me-2">
                        <i className="ri-map-pin-user-line me-1 text-black text-opacity-75 fs-16 align-middle"></i>
                        {employeeDetails.address}
                      </div>
                      <div>
                        <i className="ri-building-line me-1 text-black text-opacity-75 fs-16 align-bottom"></i>
                        {employeeDetails.phoneNumber}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h5 className="card-title mb-5">Complete Your Profile</h5>
                  <Progress
                    value={100}
                    color="danger"
                    className="animated-progress custom-progress progress-label bg-muted"
                  >
                    <div className="label">100%</div>
                  </Progress>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h5 className="card-title">Contact Me:</h5>

                  <Link to="#" className="text-body">
                    <i className="bx bxl-twitter text-primary text-opacity-75 fs-24 align-middle"></i>
                  </Link>
                  <Link to="#" className="text-body">
                    <i className="bx bxl-instagram bg-gradient-danger text-opacity-75 fs-24 align-middle "></i>
                  </Link>
                  <Link to="#" className="text-body">
                    <i className="bx bxl-github text-black text-opacity-75 fs-24 align-middle "></i>
                  </Link>
                </CardBody>
              </Card>
            </Col>

            <Col lg={8}>
              <div className="table-responsive">
                <Card>
                  <Table>
                    <tbody>
                      <tr>
                        <th className="ps-5" scope="row">
                          ID:
                        </th>
                        <td className="text-muted">{employeeDetails.id}</td>
                      </tr>
                      <tr>
                        <th className="ps-5" scope="row">
                          Name:
                        </th>
                        <td className="text-muted">{employeeDetails.name}</td>
                      </tr>
                      <tr>
                        <th className="ps-5" scope="row">
                          Date of Birth:
                        </th>
                        <td className="text-muted">{employeeDetails.dob}</td>
                      </tr>
                      <tr>
                        <th className="ps-5" scope="row">
                          Gender:
                        </th>
                        <td className="text-muted">{employeeDetails.gender}</td>
                      </tr>
                      <tr>
                        <th className="ps-5" scope="row">
                          Email:
                        </th>
                        <td className="text-muted">{employeeDetails.email}</td>
                      </tr>
                      <tr>
                        <th className="ps-5" scope="row">
                          Phone Number:
                        </th>
                        <td className="text-muted">
                          {employeeDetails.phoneNumber}
                        </td>
                      </tr>
                      <tr>
                        <th className="ps-5" scope="row">
                          Address:
                        </th>
                        <td className="text-muted">
                          {employeeDetails.address}
                        </td>
                      </tr>
                      <tr>
                        <th className="ps-5" scope="row">
                          Nationality:
                        </th>
                        <td className="text-muted">
                          {employeeDetails.nationality}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeDisplay;
