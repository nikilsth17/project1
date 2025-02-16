import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Card, CardBody, Col, Row } from "reactstrap";
import avatar3 from "../../../src/assets/images/users/avatar-3.jpg";
import DriverServices from "../../services/DriverServices/DriverServices";
import { useParams } from "react-router-dom";
import { NameInitialsAvatar } from "react-name-initials-avatar";

const DriverDetail = () => {
  const [data, setData] = useState([]);
  console.log("🚀 ~ DriverDetail ~ data:", data);

  const { id } = useParams();
  const fetchData = async () => {
    try {
      const response = await DriverServices.getById(id);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb
          pageTitle="Drivers"
          title="Driver Detail"
          breadcrumbItems={[{ title: "Back To List ", link: "/drivers" }]}
        />
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Card
          className=" p-4 shadow-sm border-0 w-75"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <Row className="mb-4">
            <Col
              lg={4}
              xs={12}
              className="d-flex justify-content-center align-items-center text-center mb-3"
            >
              <NameInitialsAvatar
                name={`${data?.name} ${data?.surname}`}
                textSize="40px"
                size="150px"
                bgColor="#D6DAC8"
                borderColor="#D6DAC8"
              />
            </Col>
            <Col lg={1} className="d-none d-lg-block">
              <div
                className="vr"
                style={{ height: "100%", backgroundColor: "#ccc" }}
              />
            </Col>
            <Col lg={7} xs={12}>
              <h6 className="fs-4 fw-bold mb-2" style={{ color: "#333" }}>
                {data?.name} {data?.surname}
              </h6>
              <hr />

              <h6 className="fs-6 fw-bold mb-1">
                <i className="fas fa-envelope me-2"></i>
                Email: {data?.email}
              </h6>
              <hr />

              <h6 className="fs-6 fw-bold mb-1">
                <i className="fas fa-phone me-2"></i>
                Phone Number: {data?.phone_number}
              </h6>
              <hr />

              <h6 className="fs-6 fw-bold mb-1">
                <i className="fas fa-id-card me-2"></i>
                Driving License Number: {data?.driving_license_no}
              </h6>
              <hr />

              <h6 className="fs-6 fw-bold mb-1">
                <i className="fas fa-map-marker-alt me-2"></i>
                Pick Up Address: {data?.address}
              </h6>
              <hr />

              <h6 className="fs-6 fw-bold mb-1">
                <i className="fas fa-globe me-2"></i>
                Issuing State: {data?.issuing_state}
              </h6>

              {data?.work_suburbs ? (
                <h6 className="fs-6 fw-bold mb-1">
                  <i className="fas fa-globe me-2"></i>
                  Issuing State: {data?.work_suburbs}
                </h6>
              ) : null}
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default DriverDetail;
