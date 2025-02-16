import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  FormGroup,
  Input,
  Label,
  Table,
  Button,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import AdvanceService from "../../../services/HRService/AdvanceServices";
import NumberWithCommas from "../Starter/NumberWithCommas";
import CreateButton from "../Starter/CreateButton";

const defData = {
  id: "",
  transaction_Date: "2023-10-01T05:40:21.1",
  remarks: "",
  verified_By: "",
  total_Amt: 0.0,
  vmDetail: [
    {
      id: "",
      employeeID: 10,
      employeeName: "",
      ref_No: "",
      amount: 0.0,
      remarks: "",
      status: 1,
    },
  ],
};

const AdvanceDisplay = (props) => {
  // Capture the 'voucherSN' parameter from the URL
  const { id } = useParams();
  console.log(id);

  const [employeeDetails, setEmployeeDetails] = useState(defData);
  // const navigate= useNavigate();
  const navigate = useNavigate();

  useEffect(() => {
    // Define an async function to fetch employee details using the 'view' API call
    async function fetchEmployeeDetails() {
      try {
        // Use the 'id' parameter in the API call
        const response = await AdvanceService.view(id);

        // Update the state with the fetched data
        setEmployeeDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

    // Call the async function to fetch employee details
    fetchEmployeeDetails();
  }, [id]);

  //   SwiperCore.use([Autoplay]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Advance " pageTitle="Advance Records Details" />
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="border-bottom-dashed p-4">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <CreateButton to="/advance-list" text="  Back to List" />
                    </div>
                  </div>
                </CardHeader>
                <CardHeader>
                  <div className="row">
                    <div className="mb-4">
                      <p className="h5 text-center">ADVANCE RECORDS</p>

                      <p></p>
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
                            {employeeDetails.transaction_Date
                              .split("T")[0]
                              .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                              .substring(0, 10)}
                          </Col>
                        </FormGroup>
                      </Col>
                    </div>
                  </div>
                </CardHeader>

                <div className="table-responsive table-bordered">
                  <Table>
                    <thead className="ml-0 bg-light">
                      <tr>
                        <th>SN</th>
                        <th>EMPLOYEE</th>
                        <th>REFERENCE NUMBER</th>
                        <th>REMARKS</th>
                        <th>AMOUNT</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {employeeDetails.vmDetail ? (
                        employeeDetails.vmDetail.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.employeeName}</td>
                            <td>{item.ref_No}</td>
                            <td>{item.remarks}</td>
                            <td className="text-end">
                              <NumberWithCommas number={item.amount} />
                            </td>
                            <td></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td></td>

                          <td colSpan="3"> TOTAL</td>
                          {/* <td colSpan="2"> Total</td> */}
                          <td className="text-end">
                            {" "}
                            <NumberWithCommas
                              number={employeeDetails.total_Amt}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td></td>

                        <td colSpan="3"> TOTAL</td>
                        {/* <td colSpan="2"> Total</td> */}
                        <td className="text-end">
                          {" "}
                          {employeeDetails.total_Amt}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>

                <table
                  className="table table-borderless table-nowrap align-middle mb-0 ms-auto"
                  style={{ width: "250px" }}
                >
                  <tbody>
                    <tr>
                      <td>REMARKS:</td>
                      <td className="text-end">{employeeDetails.remarks}</td>
                    </tr>
                    <tr>
                      <td> VERIFIED BY:</td>
                      <td className="text-end">
                        {employeeDetails.verified_By}
                      </td>
                    </tr>

                    {/* <tr className="border-top border-top-dashed fs-15">
                          <th scope="row">Total Amount</th>
                          <th className="text-end">
                            {employeeDetails.total_Amt}
                          </th>
                        </tr> */}
                  </tbody>
                </table>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AdvanceDisplay;
