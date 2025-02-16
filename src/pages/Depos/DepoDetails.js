import React from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonToggle,
  Label,
  Badge,
} from "reactstrap";
import { useState, useEffect } from "react";
import CurrencyServices from "../../services/AustServices/CurrencySe/CurrencyServices";
import CreateButton from "../Pages/Starter/CreateButton";
import ImportReasonService from "../../services/AustServices/ImportReasonService";
import DepoService from "../../services/AustServices/DepoServices/Depo";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";

const DepotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [depotDetail, setDepotDetail] = useState();
  const [loading, setLoading] = useState(true);

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedCustomer = await DepoService.view(itemId);
      console.log("Fetched Item:", fetchedCustomer);

      // Update the state to display the details of the selected item
      setDepotDetail(fetchedCustomer);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data || "An error occurred", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    // Fetch the item details when the component mounts based on the id from the URL
    viewItem(id);
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/depot-office" }];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Depot Office Detail"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Depot Office"
        />
        {loading ? (
          <Row className="justify-content-center align-items-center">
            <Col xs={2}>
              <Triangle
                visible={true}
                height="80"
                width="80"
                color="#5B71B9"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <h6 className="mt-2">Loading...</h6>
            </Col>
          </Row>
        ) : depotDetail ? (
          <Row className="justify-content-center">
            <Card>
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <CardBody>
                      <Row>
                        <Col>
                          <span className="fw-bold mb-2">Office Details:</span>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Depot:</p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.name}
                          </h6>
                        </Col>

                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Office Code:</p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.officeCode}
                          </h6>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Locality:</p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.locality}, {depotDetail?.state},{" "}
                            {depotDetail?.postalCode}
                          </h6>
                        </Col>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Country:</p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.countryName}
                          </h6>
                        </Col>
                      </Row>

                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            Address Line 1:
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.addressLine1 || "No data available"}
                          </h6>
                        </Col>

                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            Address Line 2:
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.addressLine2 || "No data available"}
                          </h6>
                        </Col>
                      </Row>
                    </CardBody>
                  </Col>
                  <Col xs={6}>
                    <CardBody>
                      <Row>
                        <Col>
                          <span className="fw-bold mb-2">Company Details:</span>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            Full Name(Contact Person):
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.fullName}
                          </h6>
                        </Col>

                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            Company Name:
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.companyName}
                          </h6>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> ABN:</p>
                          <h6 className="fs-13  fw-bold">{depotDetail?.abn}</h6>
                        </Col>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            Phone Number:
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.telePhone}
                          </h6>
                        </Col>
                      </Row>

                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Email:</p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.email || "No data available"}
                          </h6>
                        </Col>
                      </Row>
                    </CardBody>
                  </Col>

                  <Col xs={6}>
                    <CardBody>
                      <Row>
                        <Col>
                          <span className="fw-bold mb-2">AWS Credentials:</span>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            AWS Uat Vault:
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.awsuatVaultName}
                          </h6>
                        </Col>

                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            AWS Live Vault:
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.awsLiveVaultName}
                          </h6>
                        </Col>
                      </Row>
                    </CardBody>
                  </Col>
                  <Col xs={6}>
                    <CardBody>
                      <Row>
                        <Col>
                          <span className="fw-bold mb-2">Depot Status:</span>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Status:</p>
                          <h6 className="fs-13  fw-bold">
                            {depotDetail?.status ? (
                              <Badge color="success">Active</Badge>
                            ) : (
                              <Badge color="danger">Inactive</Badge>
                            )}
                          </h6>
                        </Col>
                      </Row>
                    </CardBody>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Row>
        ) : (
          <Row className="justify-content-center align-items-center">
            <p className="p-2 pt-5 justify-content-center align-item-center">
              <Col xs={12} className="text-center">
                <img
                  src="/blankdata.png"
                  alt="No data available"
                  style={{ width: "400", height: "300px" }}
                />
              </Col>
            </p>
          </Row>
        )}
      </div>
    </Container>
  );
};

export default DepotDetails;
