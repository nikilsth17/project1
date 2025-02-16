import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Table, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import SwiperCore, { Autoplay } from "swiper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import EmployeeSalaryService from "../../../services/HRService/EmployeeSalaryService";
import CreateButton from "../Starter/CreateButton";
import NumberWithCommas from "../Starter/NumberWithCommas";
SwiperCore.use([Autoplay]);

const EmployeeSalaryDisplay = () => {
  const { id } = useParams();
  const idValue = id || 0;
  const navigate = useNavigate();

  // Initialize employeeSalaryDetails as an empty object
  const [employeeSalaryDetails, setEmployeeSalaryDetails] = useState({});

  useEffect(() => {
    // Define an async function to fetch employee details using the 'view' API call
    async function fetchEmployeeDetails() {
      try {
        // Use the 'id' parameter in the API call
        const response = await EmployeeSalaryService.view(idValue);

        // Update the state with the fetched data
        setEmployeeSalaryDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

    // Call the async function to fetch employee details
    fetchEmployeeDetails();
  }, [id, idValue]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Employee Salary Detail" pageTitle="Employee" />

        <CreateButton to="/employeesalary-list" text="  Back to List" />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <div className="table-responsive">
                <Row>
                  <Col lg={6}>
                    <Card>
                      <CardBody>
                        <p> Employee Details</p>

                        <table className="table table-bordered">
                          <tbody>
                            {/* <tr>
                              <th className="ps-5" scope="row">
                                ID:
                              </th>
                              <td className="text-muted">
                                {employeeSalaryDetails.id}
                              </td>
                            </tr> */}
                            <tr>
                              <th className="ps-5" scope="row">
                                Employee:
                              </th>
                              <td className="transaction_Date">
                                {employeeSalaryDetails.employeeName}
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Basic:
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number=
                                {employeeSalaryDetails.basic}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Grade:
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number=
                                {employeeSalaryDetails.grade}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Sub Total:
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number=
                                {employeeSalaryDetails.sub_Total}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Allowance:
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number=
                                {employeeSalaryDetails.allowance}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Deductions:
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number=
                                {employeeSalaryDetails.deductions}
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
                        <p> Employee Tax Details</p>
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <th className="ps-5" scope="row">
                                Taxable Total:
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number=
                                {employeeSalaryDetails.taxable_Total}
                             />
                                </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Tax Percent:
                              </th>
                              <td className="text-muted">
                                {employeeSalaryDetails.tax_Percent}
                              </td>
                            </tr>
                            <tr className="ml-0">
                              {/* <th className="ps-5 ml-0" scope="row">
                                Taxable:
                              </th>
                              <td
                                className={`badge ${
                                  employeeSalaryDetails.is_Taxable
                                    ? "bg-success"
                                    : "bg-danger"
                                }-subtle text-uppercase text-dark`}
                              >
                                {employeeSalaryDetails.is_Taxable
                                  ? "true"
                                  : "false"}
                              </td> */}
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Tax Amount:
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number=
                                {employeeSalaryDetails.tax_Amt}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th className="ps-5" scope="row">
                                Net Payable Amount:
                              </th>
                              <td className="text-muted">
                              <NumberWithCommas 
                                  number=
                                {employeeSalaryDetails.net_Payable_Amt}
                              />
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
  );
};

export default EmployeeSalaryDisplay;
