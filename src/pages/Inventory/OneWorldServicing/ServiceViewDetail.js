import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import OneWorldServices from "../../../services/Inventory Services/OneWorldServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const ServiceViewDetail = () => {
  const { id } = useParams();
  const [customerDetail, setCustomerDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const fetchedCustomer = await OneWorldServices.view(id);
        setCustomerDetail(fetchedCustomer);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer detail:", error);
        setLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/service-list" }];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Service Detail"
        pageTitle="Service List"
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
        <Row>
          <Col lg={3}></Col>
          <Col lg={6} md={6}>
            <Card>
              <CardBody>
                <Row style={{ borderBottom: "1px solid #ddd" }}>
                  <Col lg={6} className="col-6 pb-2 pb-2">
                    <p className="mb-1 fs-14 text-muted">Service:</p>
                    <h6 className="fs-13 te mb-0  fw-bold">
                      {customerDetail.title}
                    </h6>
                  </Col>
                  <Col lg={6} className="col-6 pb-2 pb-2">
                    <p className="mb-1 fs-14 text-muted">Code:</p>
                    <h6 className="fs-13 te mb-0  fw-bold">
                      {customerDetail.code}
                    </h6>
                  </Col>
                </Row>
                <Row style={{ borderBottom: "1px solid #ddd" }}>
                  <Col lg={6} className="col-6 pb-2 pb-2">
                    <p className="mb-1 fs-14 text-muted">Discount:</p>
                    <h6 className="fs-13 te mb-0  fw-bold">
                      {customerDetail.discountPercentage}
                    </h6>
                  </Col>
                  <Col lg={6} className="col-6 pb-2 pb-2">
                    <p className="mb-1 fs-14 text-muted">
                      Additional Charge:
                    </p>
                    <h6 className="fs-13 te mb-0  fw-bold">
                      {customerDetail.additionalCharge}
                    </h6>
                  </Col>
                </Row>
                <Row style={{ borderBottom: "1px solid #ddd" }}>
                  <Col lg={6} className="col-6 pb-2 pb-2">
                    <p className="mb-1 fs-14 text-muted">
                      International Service:
                    </p>
                    <h6 className="fs-13 te mb-0  fw-bold">
                      {customerDetail.internationalServiceProviderName}
                    </h6>
                  </Col>
                  <Col lg={6} className="col-6 pb-2 pb-2">
                    <p className="mb-1 fs-14 text-muted">
                      Domestic Service:
                    </p>
                    <h6 className="fs-13 te mb-0  fw-bold">
                      {customerDetail.domesticeServiceProviderName}
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
  );
};

export default ServiceViewDetail;
