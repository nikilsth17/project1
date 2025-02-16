import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useParams } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import CustomerTypeServices from "../../services/Inventory Services/CustomerTypeServices";

const CustomerViewDetail = () => {
  const { id } = useParams();
  const [customerDetail, setCustomerDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerType = async () => {
      try {
        const fetchedCustomerType = await CustomerTypeServices.view(id);
        console.log("Fetched Customer Type:", fetchedCustomerType);
        setCustomerDetail(fetchedCustomerType);
        setLoading(false);
      } catch (error) {
        console.error("Error viewing customer type:", error);
        setLoading(false);
      }
    };

    fetchCustomerType();
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/customer-type" }];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Customer Type Detail"
        pageTitle="Customer Type "
        breadcrumbItems={breadcrumbItems}
      />

      {loading ? (
        <Row className="justify-content-center align-items-center">
          <Col xs={2}>
            <Triangle
              visible={true}
              height={80}
              width={80}
              color="#5B71B9"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <h6 className="mt-2">Loading...</h6>
          </Col>
        </Row>
      ) : customerDetail ? (
        <Container fluid>
          <Row className="d-flex justify-content-center">
            <Col lg={6}>
              <Card>
                <CardBody>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Customer Type:</p>
                      <h6 className="fs-13 te mb-0  fw-bold">
                        {customerDetail.title}
                      </h6>
                    </Col>
                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Description:</p>
                      <h6 className="fs-13 te mb-0  fw-bold">
                        {customerDetail.description}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Code:</p>
                      <h6 className="fs-13 te mb-0  fw-bold">
                        {customerDetail.code}
                      </h6>
                    </Col>
                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Discount:</p>
                      <h6 className="fs-13 te mb-0  fw-bold">
                        {customerDetail.discountPercentage}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Due Days:</p>
                      <h6 className="fs-13 te mb-0  fw-bold">
                        {customerDetail.dueDays}
                      </h6>
                    </Col>
                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Status:</p>
                      <h6 className="fs-13 te mb-0  fw-bold">
                        {customerDetail.status ? "Active" : "Inactive"}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Payment Types:</p>
                      <h6 className="fs-13 te mb-0  fw-bold">
                        {customerDetail.paymentTypes &&
                          customerDetail.paymentTypes.map((type, index) => (
                            <div key={index}>{type.name}</div>
                          ))}
                      </h6>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
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
  );
};

export default CustomerViewDetail;
