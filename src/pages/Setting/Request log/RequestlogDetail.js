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

const RequestlogDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestLogDetail, setrequestLogDetail] = useState(null);
  useEffect(() => {
    const viewItem = async (itemId) => {
      try {
        const fetchedApilog = await ConfigureSetingServices.requestlogDetail(
          itemId
        );
        console.log("Fetched Item:", fetchedApilog);
        setrequestLogDetail(fetchedApilog);
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

  const breadcrumbItems = [{ title: "Back to List  ", link: "/request-log" }];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Request Log Detail"
          pageTitle="Request Log"
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
        ) : requestLogDetail ? (
          <Row className="d-flex justify-content-center">
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={4} className="col-6 pb-2">
                      <p className="fs-14 text-muted">Date-Time</p>

                      <h6 className="fs-13 fw-bold">
                        {requestLogDetail?.timeStamp
                          ? (() => {
                              const utcDate = requestLogDetail.timeStamp;
                              const localDate = new Date(utcDate);
                              const dateParts = localDate
                                .toLocaleDateString()
                                .split("/");
                              const formattedDate = `${dateParts[2]}-${
                                dateParts[0]
                              }-${
                                dateParts[1]
                              }, ${localDate.toLocaleTimeString()}`;
                              return formattedDate;
                            })()
                          : "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 ">
                      <p className="fs-14 text-muted">Level:</p>

                      <h6 className="fs-13  fw-bold">
                        {requestLogDetail?.level || "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 ">
                      <p className="fs-14 text-muted"> Message Template:</p>

                      <h6 className="fs-13  fw-bold">
                        {requestLogDetail?.messageTemplate ||
                          "No data available"}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 ">
                      {/* <p className="fs-14 text-muted"> Message:</p> */}
                      <Row>
                        <Col xs={4}>
                          <p className="fs-14 text-muted">Message:</p>
                        </Col>
                        <Col className="text-end">
                          <h5>
                            <i
                              title="Copy Text"
                              class="bx bx-copy-alt mt-1 cursor-pointer text-primary "
                              onClick={() => {
                                copy(requestLogDetail?.message);
                                toast.success("Copied to the clipboard");
                              }}
                            ></i>
                          </h5>
                        </Col>
                      </Row>

                      <h6 className="fs-13  fw-bold">
                        {requestLogDetail?.message || "No data available"}
                      </h6>
                    </Col>
                    <Col lg={6} className="col-6 pb-2 ">
                      <p className="fs-14 text-muted"> Exception:</p>

                      <h6 className="fs-13  fw-bold">
                        {requestLogDetail?.exception || "No data available"}
                      </h6>
                    </Col>
                  </Row>

                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={12} className="col-6 pb-2 ">
                      {/* <p className="fs-14 text-muted">Properties:</p> */}
                      <Row>
                        <Col xs={4}>
                          <p className="fs-14 text-muted">Properties:</p>
                        </Col>
                        <Col className="text-end">
                          <h5>
                            <i
                              title="Copy Text"
                              class="bx bx-copy-alt mt-1 cursor-pointer text-primary "
                              onClick={() => {
                                copy(requestLogDetail?.properties);
                                toast.success("Copied to the clipboard");
                              }}
                            ></i>
                          </h5>
                        </Col>
                      </Row>

                      <h6 className="fs-13  fw-bold">
                        {requestLogDetail?.properties || "No data available"}
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

export default RequestlogDetail;
