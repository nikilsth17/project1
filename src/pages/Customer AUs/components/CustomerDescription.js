import React from "react";
import { Badge, Card, Col, Row } from "reactstrap";
import { NameInitialsAvatar } from "react-name-initials-avatar";

const CustomerDescription = ({ customerDetails }) => {
  console.log("🚀 ~ CustomerDescription ~ customerDetails:", customerDetails);
  return (
    <Row>
      <Col>
        {customerDetails.length === 0 ? (
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
        ) : (
          <div className="profile-foreground position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg"></div>
          </div>
        )}
        <Row className="pt-3 mb-2 mb-lg-3 pb-lg-2">
          <Col xs={2}>
            <NameInitialsAvatar
              bgColor={"white"}
              borderColor={"white"}
              textSize="30px"
              textColor={"green"}
              size="80px"
              name={`${customerDetails.firstName} ${customerDetails.lastName}`}
            />
          </Col>
          <Col lg={7} md={10}>
            <Row>
              <Col md={6}>
                <div className="p-2">
                  <h5 className=" m-0 text-white ">
                    {customerDetails.firstName} {customerDetails.lastName}
                  </h5>
                  <p className=" m-0 text-white ">
                    <i class="bx bx-envelope"></i>
                    {"  "}
                    {customerDetails.emailAddress}
                  </p>
                  <p className=" m-0 text-white ">
                    <i class="bx bx-current-location"></i>
                    {"  "}
                    {customerDetails.addressLine1}
                  </p>
                  <p className=" m-0 text-white ">
                    <i class="bx bx-location-plus"></i>
                    {"  "}
                    {customerDetails.city},{customerDetails.state},{" "}
                    {customerDetails.postCode}, {customerDetails.countryName}
                  </p>
                </div>
              </Col>
              {customerDetails.isBusiness && (
                <Col md={6}>
                  <div className="p-2">
                    <h5 className=" m-0 text-white ">
                      {customerDetails.companyName}
                    </h5>

                    <p className=" m-0 text-white ">
                      <i class="bx bx-envelope"></i>
                      {"  "}
                      {customerDetails.accountStatementEmail}
                    </p>
                    <p className=" m-0 text-white ">
                      <i class="bx bx-phone-call"></i>
                      {"  "}
                      {customerDetails.companyPhoneNumber}
                    </p>
                    <p className=" m-0 text-white ">
                      <i class="bx bx-font"></i>
                      {"  "} {customerDetails.companyAbn}
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          </Col>

          <Col lg={3}>
            <div className="p-2">
              {customerDetails.customerType && (
                <p className="text-white m-0 text-white ">
                  Customer Type : {customerDetails.customerType.title}
                </p>
              )}

              {customerDetails.isSystemVerified && (
                <p className="text-white m-0 text-white ">
                  Customer Accounting System Id:{" "}
                  {customerDetails.accountingSystemId}
                </p>
              )}
              {customerDetails.isSystemVerified ? (
                <h5>
                  <Badge
                    className="cursor-pointer"
                    title={`Customer Accounting System Id:${customerDetails.accountingSystemId}`}
                    color="success"
                  >
                    Verified
                  </Badge>
                </h5>
              ) : (
                <h5>
                  <Badge color="warning">Not Verified</Badge>
                </h5>
              )}
              {customerDetails.password && (
                <span className="text-white">
                  Password: {customerDetails.password}
                </span>
              )}
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default CustomerDescription;
