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
  FormGroup,
  CardHeader,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PayrollService from "../../../services/HRService/PayrollService";
import CreateButton from "../Starter/CreateButton";
import NumberWithCommas from "../Starter/NumberWithCommas";

const defData = {
  id: 0,
  transaction_Date: "2023-10-08T09:25:08.086Z",
  month: "2023-10-08T09:25:08.086Z",
  remarks: "string",
  verified_By: "string",
  total_Amt: 0,
  vmPayrollDetail: [
    {
      id: 0,
      employeeID: 0,
      employeeName: "string",
      ref_No: "string",
      salary_Amt: 0,
      payable_Amt: 0,
      paid_Amt: 0,
      remarks: "string",
      status: true,
    },
  ],
};

const PayrollDisplay = (props) => {
  // Capture the 'voucherSN' parameter from the URL
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();

  const [payrollDetails, setPayrollDetails] = useState(defData);

  useEffect(() => {
    // Define an async function to fetch employee details using the 'view' API call
    async function fetchPayrollDetails() {
      try {
        // Use the 'id' parameter in the API call
        const response = await PayrollService.view(id);

        // Update the state with the fetched data
        setPayrollDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

    // Call the async function to fetch employee details
    fetchPayrollDetails();
  }, [id]);

  //   SwiperCore.use([Autoplay]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Payroll Details" pageTitle="Payroll" />

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
                      <CreateButton to="/payroll-list" text="  Back to List" />
                    </div>
                  </div>
                </CardHeader>
                <CardHeader>
                  <div className="mb-4">
                    <p className="h5 text-center">PAYROLL RECORDS</p>
                  </div>
                  <div className="gap-3">
                    <Col lg={12}>
                      <FormGroup row>
                        <Col lg={3}>
                          <span className="font-weight-bold text-uppercase">
                            TRANSACTION DATE:
                          </span>{" "}
                        </Col>
                        <Col lg={3} className="text-end">
                          {payrollDetails.transaction_Date
                            .split("T")[0]
                            .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                            .substring(0, 10)}
                        </Col>

                        <Col lg={3}>
                          <span className="font-weight-bold text-uppercase">
                            Month:
                          </span>{" "}
                        </Col>
                        <Col lg={3} className="text-end">
                          {payrollDetails.remarks}
                        </Col>
                      </FormGroup>
                    </Col>
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
                          <th>REMARKS</th>
                          <th>SALARY AMOUNT</th>
                          <th>PAYABLE AMOUNT</th>

                          <th>PAID AMOUNT</th>

                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {payrollDetails.vmPayrollDetail ? (
                          payrollDetails.vmPayrollDetail.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>

                              <td>{item.employeeName}</td>
                              <td>{item.ref_No}</td>
                              <td>{item.remarks}</td>
                              <td className="text-end">
                                <NumberWithCommas number={item.salary_Amt} />
                              </td>
                              <td className="text-end">
                                <NumberWithCommas number={item.payable_Amt} />
                              </td>
                              <td className="text-end">
                                <NumberWithCommas number={item.paid_Amt} />
                              </td>

                              {/* <td>{item.status}</td> */}

                              <td>{/* Add action elements here */}</td>
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
                        <td className="text-end">{payrollDetails.remarks}</td>
                      </tr>
                      <tr>
                        <td> VERIFIED BY:</td>
                        <td className="text-end">
                          {payrollDetails.verified_By}
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

export default PayrollDisplay;
