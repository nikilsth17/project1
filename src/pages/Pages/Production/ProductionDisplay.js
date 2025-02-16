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
import ProductionService from "../../../services/HRService/ProductionService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import NumberWithCommas from "../Starter/NumberWithCommas";
import CreateButton from "../Starter/CreateButton";

const defData = {
  id: 19,
  transaction_Date: "2023-10-04T05:42:51.085",
  remarks: "string",
  verified_By: "staff",
  rate: 15,
  total_Amt: 1650.0,
  vmProductionDetail: [
    {
      id: 57,
      employeeID: 13,
      employeeName: "Ram",
      ref_No: "221",
      quantity: 110.0,
      amount: 1650.0,
      remarks: "string",
      status: true,
    },
  ],
};

const ProductionDisplay = (props) => {
  // Capture the 'voucherSN' parameter from the URL
  const { id } = useParams();
  console.log(id);

  const [productionDetails, setProductionDetails] = useState(defData);
  // const navigate=useNavigate();
  const navigate = useNavigate();

  useEffect(() => {
    // Define an async function to fetch employee details using the 'view' API call
    async function fetchProductionDetails() {
      try {
        // Use the 'id' parameter in the API call
        const response = await ProductionService.view(id);

        // Update the state with the fetched data
        setProductionDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

    // Call the async function to fetch employee details
    fetchProductionDetails();
  }, [id]);

  //   SwiperCore.use([Autoplay]);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Production Details" pageTitle="Production" />

        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="border-bottom-dashed p-4">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <CreateButton
                        to="/production-list"
                        text="  Back to List"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardHeader>
                  <div className="row">
                    <div className="mb-4">
                      <p className="h5 text-center">PRODUCTION RECORDS</p>
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
                            {productionDetails.transaction_Date
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
                            {productionDetails.rate}
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
                      {productionDetails.vmProductionDetail ? (
                        productionDetails.vmProductionDetail.map(
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
                          <NumberWithCommas
                            number={productionDetails.total_Amt}
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                  <div className="d-flex justify-content-end p-3">
                    <div>
                      <FormGroup row>
                        <Col lg={12} className="text-end">
                          <span className="px-5 font-weight-bold">
                            REMARKS:
                          </span>
                          {productionDetails.remarks}
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col lg={12} className="text-end">
                          <span className="px-5 font-weight-bold">
                            VERIFIED BY:
                          </span>
                          {productionDetails.verified_By}
                        </Col>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductionDisplay;
