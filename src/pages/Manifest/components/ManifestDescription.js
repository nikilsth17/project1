import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Triangle } from "react-loader-spinner";

const ManifestDescription = ({ manifestDetail }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Function to view item details
  // const viewItem = async (itemId) => {
  //   try {
  //     const fetchedCustomer = await DepoService.view(itemId);
  //     console.log("Fetched Item:", fetchedCustomer);

  //     // Update the state to display the details of the selected item
  //     setDepotDetail(fetchedCustomer);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     toast.error(error?.response?.data || "An error occurred", {
  //       autoClose: 3000,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   // Fetch the item details when the component mounts based on the id from the URL
  //   viewItem(id);
  // }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/manifest-list" }];
  return (
    <Container fluid>
      <BreadCrumb
        title="Manifest Detail"
        breadcrumbItems={breadcrumbItems}
        pageTitle="Manifest Details"
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
      ) : !loading ? (
        <Row className="justify-content-start">
          <Col lg={6} md={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <CardBody>
                      <Row className="mb-2">
                        <Col xs={6}>
                          <span className="fw-bold mb-2">
                            Manifest Details:
                          </span>
                        </Col>
                        <Col className="">
                          <div
                            className="cursor-pointer text-primary text-decoration-underline"
                            onClick={() => {
                              window.open(
                                `/manifest-docs-viewer/${id}`,
                                "_blank"
                              );
                            }}
                          >
                            <i class="bx bx-file fs-5 me-1"></i>
                            <span className="me-2">View PDF</span>
                          </div>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Manifest Id:</p>
                          <h6 className="fs-13  fw-bold">
                            {/* {depotDetail?.name}
                             */}
                            {manifestDetail?.manifestId}
                          </h6>
                        </Col>

                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            Created Date:
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {new Date(
                              manifestDetail?.createdDate
                            ).toLocaleString()}
                          </h6>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Admin:</p>
                          <h6 className="fs-13  fw-bold">
                            {manifestDetail?.createdBy}
                          </h6>
                        </Col>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> IP Address:</p>
                          <h6 className="fs-13  fw-bold">
                            {manifestDetail?.ipAddress}
                          </h6>
                        </Col>
                      </Row>

                      <Row style={{ borderBottom: "1px solid #ddd" }}>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted">
                            {" "}
                            Depot Office:
                          </p>
                          <h6 className="fs-13  fw-bold">
                            {manifestDetail?.depotOffice}

                            {/* {depotDetail?.addressLine1 || "No data available"} */}
                          </h6>
                        </Col>
                        <Col lg={6} className="col-6 pb-2 ">
                          <p className="mb-1 fs-14 text-muted"> Status:</p>
                          <h6 className="fs-13  fw-bold">
                            {manifestDetail?.status}
                            {/* {depotDetail?.addressLine1 || "No data available"} */}
                          </h6>
                        </Col>
                      </Row>
                    </CardBody>
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
                src="/blankdata.png"
                alt="No data available"
                style={{ width: "400", height: "300px" }}
              />
            </Col>
          </p>
        </Row>
      )}
    </Container>
  );
};

export default ManifestDescription;
