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
import ShiftingToDockService from "../../../services/HRService/ShiftingToDockService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import NumberWithCommas from "../Starter/NumberWithCommas";
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

const ShiftingToDockDisplay = (props) => {
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
        const response = await ShiftingToDockService.view(id);

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
      <div className="page-content">
        <BreadCrumb
          title="Shifting-To-Dock Details"
          pageTitle="Shifting-To-Dock"
        />
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="border-bottom-dashed p-4">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <CreateButton
                        to="/shiftingtodock-list"
                        text="  Back to List"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardHeader>
                  <div className="row">
                    <div className="mb-4">
                      <p className="h5 text-center">SHIFTING TO DOCK RECORDS</p>

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
                              RATE:
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
                        shiftingDetails.vmShiftingDetail.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>

                            <td>{item.employeeName}</td>
                            <td>{item.ref_No}</td>
                            <td>{item.quantity}</td>
                            <td>{item.remarks}</td>
                            <td className="text-end">
                              <NumberWithCommas number={item.amount} />
                            </td>
                            <td>{item.employeeName}</td>
                            <td>{item.ref_No}</td>
                            <td>
                              <NumberWithCommas number={item.quantity} />
                            </td>
                            <td>{item.remarks}</td>
                            <td className="text-end">
                              <NumberWithCommas number={item.amount} />
                            </td>

                            <td>{/* Add action elements here */}</td>
                          </tr>
                        ))
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
                          <NumberWithCommas
                            number={shiftingDetails.total_Amt}
                          />
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
                      <td className="text-end">{shiftingDetails.remarks}</td>
                    </tr>
                    <tr>
                      <td> VERIFIED BY:</td>
                      <td className="text-end">
                        {shiftingDetails.verified_By}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </Col>
          </Row>
          <Row></Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ShiftingToDockDisplay;
