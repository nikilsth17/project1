import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Form,
  Label,
  Card,
  CardBody,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ConfigureSettingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import { Triangle } from "react-loader-spinner";

const ServiceExtra = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await ConfigureSettingServices.serviceview(id);
      setServiceData(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching service data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = () => {
    navigate(`/serviceextra-list/edit/${id}`);
  };

  const breadcrumbItems = [
    {
      title: "Back to List",
      link: "/service-setting",
    },
  ];

  const Title = (() => {
    switch (id) {
      case "1":
        return "Aramex ";
      case "2":
        return "AusPost ";
      case "3":
        return "CourierPlease ";
      default:
        return "";
    }
  })();
  const pageTitle = (() => {
    switch (id) {
      case "1":
        return "Aramex Detail";
      case "2":
        return "AusPost Detail";
      case "3":
        return "CourierPlease Detail";
      default:
        return "";
    }
  })();

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title={Title}
          pageTitle={pageTitle}
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
        ) : serviceData ? (
          <Row>
            <Col lg={3}></Col>
            <Col lg={12} md={6}>
              <Card>
                <CardBody>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Signature Rate:</p>
                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.signatureRate
                          ? `${serviceData.signatureRate} AUD`
                          : "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Extra Fuel Rate:</p>

                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.extraFuelChargeRate
                          ? `${serviceData.extraFuelChargeRate} %`
                          : "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Over Weight Rate:</p>
                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.overWeightRate
                          ? `${serviceData.overWeightRate} AUD`
                          : "No data available"}
                      </h6>
                    </Col>
                  </Row>

                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Max Dead Weight:</p>
                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.maxDeadWeight
                          ? `${serviceData.maxDeadWeight} Kg`
                          : "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Max Vol. Weight:</p>

                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.maxVolumetricWeight
                          ? `${serviceData.maxVolumetricWeight} Kg`
                          : "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Over Weight:</p>

                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.overWeight
                          ? `${serviceData.overWeight} Kg`
                          : "No data available"}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Max Size:</p>

                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.maxSize
                          ? `${serviceData.maxSize} cm`
                          : "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Over Size:</p>

                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.overSize
                          ? `${serviceData.overSize} cm`
                          : "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">Over Size Rate:</p>

                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.overSizeRate
                          ? `${serviceData.overSizeRate} AUD`
                          : "No data available"}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">
                        Applicable Service :
                      </p>
                      <h6 className="fs-13 te mb-0  fw-bold">
                        {serviceData?.applicableServiceTypeCodes ||
                          "No data available"}
                      </h6>
                    </Col>
                    <Col lg={4} className="col-6 pb-2 pb-2">
                      <p className="mb-1 fs-14 text-muted">
                        Additional Charge:
                      </p>
                      <h6 className="fs-13 te mb-0 fw-bold">
                        {serviceData?.additionalCharge &&
                          `${serviceData.additionalCharge} AUD`}
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

export default ServiceExtra;
