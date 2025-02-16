import React, { useEffect, useState } from "react";
import { NameInitialsAvatar } from "react-name-initials-avatar";
import AuthServices from "../../../../services/DibyaServices/AuthServices/Auth.services";
import { useParams } from "react-router-dom";
import { Card, Col, Input, Row } from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const ViewAdminPage = () => {
  const { id } = useParams();
  const [adminDetail, setAdminDetail] = useState();

  useEffect(() => {
    (async () => {
      try {
        const response = await AuthServices.getAdminById(id);
        setAdminDetail(response);
      } catch (error) {
        console.log("🚀 ~ async ~ error:", error);
      }
    })();
  }, []);
  const breadcrumbItems = [
    { title: "Back To List ", link: "/admin-registration" },
  ];

  return (
    <div className="page-content">
      <BreadCrumb
        pageTitle="Admin"
        title="Admin Detail"
        breadcrumbItems={breadcrumbItems}
      />

      <Row className="mb-4">
        <Col lg={2} className="text-center">
          <div>
            <NameInitialsAvatar
              name={
                (`${adminDetail?.user?.userName}`,
                `${adminDetail?.user?.userName}`)
              }
              textSize="56px"
              size={"150px"}
              bgColor="#D6DAC8"
              borderColor="#D6DAC8"
            />
          </div>
        </Col>
        <Col lg={6} className="">
            <Row >
              <Col lg={12} className="col-6 pb-2 mt-4">
               
                <h6 className="fs-13  fw-bold">{adminDetail?.user.userName}</h6>
<div className="d-flex gap-1">
                <h6 className="fs-13  fw-bold">{adminDetail?.user.email}</h6> ||  {adminDetail?.user.phoneNumber} </div>
                <h6 className="fs-13  fw-bold">{adminDetail?.user.address}</h6>
                <h6 className="fs-13  fw-bold">{adminDetail?.roles[0]}</h6>

              </Col>
             
            </Row>
            
        </Col>
      </Row>
    </div>
  );
};

export default ViewAdminPage;
