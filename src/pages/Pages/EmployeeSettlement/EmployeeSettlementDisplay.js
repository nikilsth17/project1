import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Table,
  Button,
  CardHeader,
  FormGroup,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import AdvanceService from "../../../services/HRService/AdvanceServices";
import NumberWithCommas from "../Starter/NumberWithCommas";
import EmployeeSettlementService from "../../../services/HRService/EmployeeSettlementService";
import CreateButton from "../Starter/CreateButton";

const defData = {
  id: 117,
  _Date: "2023-11-09T03:45:38.117",
  settlement_Date: "2023/11/09",
  remarks: "string",
  verified_By: "Admin",
  vmSetDetails: [
    {
      id: 237,
      employeeID: 16,
      employeeName: "rushali lage",
      ref_No: "string",
      paid_Amt: 7990,
      received_Amt: 700,
      remarks: "string",
      is_Verified: false,
      status: true,
    },
  ],
};

const EmployeeSettlementDisplay = (props) => {
  // Capture the 'voucherSN' parameter from the URL
  const { id } = useParams();
  console.log(id);

  const [settlementDetails, setSettlementDetails] = useState(defData);
  // const navigate= useNavigate();
  const navigate = useNavigate();

  useEffect(() => {
    // Define an async function to fetch employee details using the 'view' API call
    async function fetchsettlementDetails() {
      try {
        // Use the 'id' parameter in the API call
        const response = await EmployeeSettlementService.view(id);

        // Update the state with the fetched data
        setSettlementDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

    // Call the async function to fetch employee details
    fetchsettlementDetails();
  }, [id]);

  //   SwiperCore.use([Autoplay]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title="Employee Settlement "
          pageTitle="Employee Settlement Details"
        />
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="border-bottom-dashed p-4">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <div className="mt-sm-5 mt-4"></div>
                    </div>
                    <div className="flex-shrink-0 mt-sm-0 mt-3">
                      <CreateButton
                        to="/settlement-list"
                        text="  Back to List"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardHeader>
                  <div className="row">
                    <div className="mb-4">
                      <p className="h5 text-center">
                        EMPLOYEE SETTLEMENT RECORDS
                      </p>

                      <p></p>
                    </div>
                    <div className="gap-3">
                      <Col lg={12}>
                        <FormGroup row>
                          <Col lg={3}>
                            <span className="font-weight-bold text-uppercase">
                              SETTLEMENT DATE :
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {settlementDetails._Date
                              .split("T")[0]
                              .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                              .substring(0, 10)}
                          </Col>
                        </FormGroup>
                      </Col>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-bordered">
                    <Table>
                      <thead className="ml-0 bg-light">
                        <tr>
                          <th>SN</th>
                          <th>EMPLOYEE</th>
                          <th>REFERENCE NUMBER</th>
                          <th>PAID AMOUNT</th>
                          <th>RECEIVED AMOUNT</th>
                          <th>REMARKS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {settlementDetails.vmSetDetails ? (
                          settlementDetails.vmSetDetails.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.employeeName}</td>

                              <td>{item.ref_No}</td>
                              <td>
                                <NumberWithCommas
                                number={item.paid_Amt} />
                                </td>
                              <td>
                              <NumberWithCommas
                                number={item.received_Amt} />
                                </td>
                              <td>{item.remarks}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7">No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  <table
                    className="table table-borderless table-nowrap align-middle mb-0 ms-auto"
                    style={{ width: "250px" }}
                  >
                    <tbody>
                      <tr>
                        <td>REMARKS:</td>
                        <td className="text-end">
                          {settlementDetails.remarks}
                        </td>
                      </tr>
                      <tr>
                        <td> VERIFIED BY:</td>
                        <td className="text-end">
                          {settlementDetails.verified_By}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeSettlementDisplay;
