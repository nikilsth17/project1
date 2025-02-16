import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Button,
  Container,
  Row,
  Table,
  CardHeader,
  FormGroup,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import ShiftingToCounterService from "../../../services/HRService/ShiftingToCounterService";
import NumberWithCommas from "../Starter/NumberWithCommas";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CreateButton from "../Starter/CreateButton";

const defData = {
  id: 26,
  transaction_Date: "2023-10-04T09:20:17.165",
  remarks: "string",
  verified_By: "staff",
  rate: 20,
  total_Amt: 2000.0,
  vmShiftingDetail: [
    {
      id: 29,
      employeeID: 12,
      employeeName: "hello editor",
      ref_No: "2216",
      quantity: 10.0,
      amount: 200.0,
      remarks: "string",
      status: true,
    },
    {
      id: 31,
      employeeID: 12,
      employeeName: "hello editor",
      ref_No: "2217",
      quantity: 90.0,
      amount: 1800.0,
      remarks: "string",
      status: true,
    },
  ],
};

const ShiftingToCounterDisplay = (props) => {
  // Capture the 'voucherSN' parameter from the URL
  const { id } = useParams();
  console.log(id);

  const [shiftingDetails, setshiftingDetails] = useState(defData);
  const navigate = useNavigate();

  useEffect(() => {
    // Define an async function to fetch employee details using the 'view' API call
    async function fetchShiftingDetails() {
      try {
        // Use the 'id' parameter in the API call
        const response = await ShiftingToCounterService.view(id);

        // Update the state with the fetched data
        setshiftingDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

    // Call the async function to fetch employee details
    fetchShiftingDetails();
  }, [id]);

  //   SwiperCore.use([Autoplay]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      {/* <LayoutWithBreadCrumb title="Shifting-To-Counter Details" pageTitle="Shifting-To-Counter"> */}
      <div className="page-content">
        <BreadCrumb
          title="Shifting-To-Counter Details"
          pageTitle="Shifting-To-Counter"
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
                        to="/shiftingtocounter-list"
                        text="  Back to List"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardHeader>
                  <div className="row">
                    <div className="mb-4">
                      <p className="h5 text-center">
                        SHIFTING TO COUNTER RECORDS
                      </p>

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
                            {shiftingDetails.transaction_Date
                              .split("T")[0]
                              .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                              .substring(0, 10)}
                          </Col>

                          <Col lg={3}>
                            <span className="font-weight-bold text-uppercase">
                              RATE
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            <NumberWithCommas number={shiftingDetails.rate} />
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
                          <th>QUANTITY</th>
                          <th>REMARKS</th>
                          <th>AMOUNT</th>

                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {shiftingDetails.vmShiftingDetail ? (
                          shiftingDetails.vmShiftingDetail.map(
                            (item, index) => (
                              <tr key={item.id}>
                                <td>{index + 1}</td>

                                <td>{item.employeeName}</td>
                                <td>{item.ref_No}</td>
                                <td className="text-end">
                                  <NumberWithCommas number={item.quantity} />
                                </td>
                                <td>{item.remarks}</td>
                                <td className="text-end">
                                  <NumberWithCommas number={item.amount} />
                                </td>

                                <td>{/* Add action elements here */}</td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan="7">No data available</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td></td>

                          <td colSpan="4"> TOTAL</td>
                          {/* <td colSpan="2"> Total</td> */}
                          <td className="text-end">
                            {" "}
                            {shiftingDetails.total_Amt}
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                  <div className="d-flex justify-content-end p-3">
                    <div>
                      <FormGroup row>
                        <Col lg={12} className="text-end">
                          <span className="px-5 font-weight-bold">
                            REMARKS:
                          </span>
                          {shiftingDetails.remarks}
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col lg={12} className="text-end">
                          <span className="px-5 font-weight-bold">
                            VERIFIED BY:
                          </span>
                          {shiftingDetails.verified_By}
                        </Col>
                      </FormGroup>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row></Row>
        </Container>
      </div>
      {/* </LayoutWithBreadCrumb> */}
    </React.Fragment>
  );
};

export default ShiftingToCounterDisplay;
