import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  ButtonGroup,
} from "reactstrap";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";

const EmailLogDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const [apilogDetail, setApilogDetail] = useState(null);
  useEffect(() => {
    const viewItem = async (itemId) => {
      try {
        setLoading(true);
        const fetchedApilog = await ConfigureSetingServices.apiloglistDetail(
          itemId
        );
        console.log("Fetched Item:", fetchedApilog);
        setApilogDetail(fetchedApilog);
      } catch (error) {
        console.error("Error viewing item:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    // Call viewItem to fetch data
    viewItem(id);
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List  ", link: "/api-log" }];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Apilog Detail"
          pageTitle="Api log"
          breadcrumbItems={breadcrumbItems}
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
        ) : apilogDetail ? (
          <Row className="d-flex justify-content-center">
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={4} className="col-6 pb-2 ">
                      <p className="fs-14 text-muted"> Application Name:</p>

                      <h6 className="fs-13  fw-bold">
                        {apilogDetail?.applicationName}
                      </h6>
                    </Col>

                    <Col lg={4} className="col-6 pb-2 ">
                      <p className="fs-14 text-muted"> Date:</p>

                      <h6 className="fs-13  fw-bold">
                        {apilogDetail?.timestamp}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 ">
                      <p className="fs-14 text-muted">Status Code:</p>

                      <h6 className="fs-13  fw-bold">
                        {apilogDetail?.responseStatusCode}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2">
                      <p className="fs-14 text-muted">Http Method:</p>

                      <h6 className="fs-13  fw-bold">
                        {apilogDetail?.httpMethod}
                      </h6>
                    </Col>

                    <Col lg={6} className="col-6 pb-2 ">
                      {/* <p className="fs-14 text-muted"> Path:</p> */}
                      <Row>
                        <Col xs={4}>
                          <p className="fs-14 text-muted">Path:</p>
                        </Col>
                        <Col className="text-end">
                          <h5>
                            <i
                              title="Copy Text"
                              class="bx bx-copy-alt mt-1 cursor-pointer text-primary "
                              onClick={() => {
                                copy(apilogDetail?.path);
                                toast.success("Copied to the clipboard");
                              }}
                            ></i>
                          </h5>
                        </Col>
                      </Row>

                      <h6 className="fs-13  fw-bold">{apilogDetail?.path}</h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 ">
                      {/* <p className="fs-14 text-muted">Request Body:</p> */}
                      <Row>
                        <Col xs={4}>
                          <p className="fs-14 text-muted">Request Body:</p>
                        </Col>
                        <Col className="text-end">
                          <h5>
                            <i
                              title="Copy Text"
                              class="bx bx-copy-alt mt-1 cursor-pointer text-primary "
                              onClick={() => {
                                copy(apilogDetail?.requestBody);
                                toast.success("Copied to the clipboard");
                              }}
                            ></i>
                          </h5>
                        </Col>
                      </Row>

                      <h6 className="fs-13  fw-bold">
                        {apilogDetail?.requestBody}
                      </h6>
                    </Col>

                    <Col lg={6} className="col-6 pb-2 ">
                      <p className="fs-14 text-muted">Request Headers:</p>
                      {/* <Row>
                        <Col xs={4}>
                          <p className="fs-14 text-muted">Request Headers:</p>
                        </Col>
                        <Col className="text-end">
                          <h5>
                            <i
                              title="Copy Text"
                              class="bx bx-copy-alt mt-1 cursor-pointer text-primary "
                              onClick={() => {
                                copy(apilogDetail?.requestHeaders);
                                toast.success("Copied to the clipboard");
                              }}
                            ></i>
                          </h5>
                        </Col>
                      </Row> */}

                      <h6 className="fs-13  fw-bold">
                        {apilogDetail?.requestHeaders}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 ">
                      <Row>
                        <Col xs={3}>
                          <p className="fs-14 text-muted">Response Body:</p>
                        </Col>
                        <Col className="text-end">
                          <h5>
                            <i
                              title="Copy Text"
                              class="bx bx-copy-alt mt-1 cursor-pointer text-primary "
                              onClick={() => {
                                copy(apilogDetail?.responseBody);
                                toast.success("Copied to the clipboard");
                              }}
                            ></i>
                          </h5>
                        </Col>
                      </Row>
                      <h6 className="fs-13  fw-bold">
                        {apilogDetail?.responseBody}
                      </h6>{" "}
                      <p></p>
                    </Col>

                    <Col lg={6} className="col-6 pb-2 ">
                      <p className="fs-14 text-muted">Response Headers:</p>

                      {/* <Row>
                        <Col xs={4}>
                          <p className="fs-14 text-muted">Response Headers:</p>
                        </Col>
                        <Col className="text-end">
                          <h5>
                            <i
                              title="Copy Text"
                              class="bx bx-copy-alt mt-1 cursor-pointer text-primary "
                              onClick={() => {
                                copy(apilogDetail?.responseHeaders);
                                toast.success("Copied to the clipboard");
                              }}
                            ></i>
                          </h5>
                        </Col>
                      </Row> */}

                      <h6 className="fs-13  fw-bold">
                        {apilogDetail?.responseHeaders}
                      </h6>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-center align-items-center">
            <p className="p-2 pt-5 justify-content-center align-item-center">
              <Col xs={12} className="text-center">
                <img
                  src="blankdata.png"
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

export default EmailLogDetail;
