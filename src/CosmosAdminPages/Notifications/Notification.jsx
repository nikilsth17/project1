
import React from "react";
import { Card, Col, Row } from "reactstrap";

const Notification = () => {
  return (
    <>
      <Card className="p-4" style={{ borderRadius: "15px" }}>
        <h6 className="fs-14">Notification</h6>
        <Row className="mt-3">
          <Col lg={12} className="d-flex justify-content-between mb-1">
            <h6 className="fs-12">Email notification</h6>
            <div class="form-check form-switch custom-checkbox">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
            </div>
          </Col>
          <hr
            className="middle"
            style={{
              width: "95%",
              minWidth: "200px",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 5,
            }}
          />
          <Col lg={12} className="d-flex justify-content-between mb-1">
            <h6 className="fs-12">SMS notification</h6>
            <div class="form-check form-switch custom-checkbox ">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                color="success"
              />
            </div>
          </Col>
          <hr
            className="middle"
            style={{
              width: "95%",
              minWidth: "200px",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 5,
            }}
          />
          <Col lg={12} className="d-flex justify-content-between">
            <h6 className="fs-12">Appointment reminder</h6>
            <div class="form-check form-switch custom-checkbox">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Notification;
