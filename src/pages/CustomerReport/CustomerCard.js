import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const CustomerCard = ({ customer }) => {
  return (
    <Row>
      {customer?.map((customerItem, index) => (
        <Col key={index} xs={6}>
          <Card className="rounded-3 pt-0">
            <CardBody>
              <Row className="pt-2">
                <Col xs={7}>
                  <div className="d-flex gap-5">
                    <h5 className="text-secondary">
                      <img
                        src="avatar-1.jpg"
                        alt="Avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "8px",
                          borderRadius: "50%",
                        }}
                      />
                    </h5>
                    <div>
                      <h6 className="fs-13 mb-0 text-muted">
                        {customerItem.firstName} {customerItem.lastName}
                      </h6>
                      <h6 className="fs-13 mb-0 text-muted">
                        {customerItem.phoneNumber}
                      </h6>
                      <h6 className="fs-13 mb-0 text-muted">
                        {customerItem.emailAddress}
                      </h6>
                      <h6 className="fs-13 mb-0 text-muted">
                        {customerItem.company}
                      </h6>
                    </div>
                  </div>
                </Col>
                <Col xs={5}>
                  <div className="text-muted fs-13">
                    <i className="bx bxs-home" />
                    {customerItem.city},{customerItem.state},
                    {customerItem.postCode}
                  </div>
                  <div className="text-muted fs-13">
                    <i className="bx bxs-building" />
                    {customerItem.addressLine1}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      ))}
      {customer && customer.length === 0 && (
        <Col xs={12}>
          <Card className="p-2">
            <p className="text-muted fs-16">No Data Available</p>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default CustomerCard;
