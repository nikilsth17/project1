import React from "react";
import { Badge, Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const QuickFacts = ({ invoice }) => {
  return (
    <Card>
      <CardHeader style={{ height: "3rem" }} className="bg-secondary">
        <h5 className="text-white">Quick Facts</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={6} className="mb-3">
            <Row>
              <span className="fw-bold">Invoice Total</span>
              <span>${invoice?.totalAmount}</span>
            </Row>
          </Col>
          <Col xs={6}>
            <Row>
              <span className="fw-bold">Status</span>
              {invoice?.isPaid ? (
                <h5>
                  <Badge color="success">Paid</Badge>
                </h5>
              ) : (
                <h5>
                  <Badge color="warning">Outstanding</Badge>
                </h5>
              )}
            </Row>
          </Col>
          <Col xs={6} className="mb-3">
            <Row>
              <span className="fw-bold">Issue Date</span>
              <span>
                {" "}
                {new Date(invoice?.invoiceDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </Row>
          </Col>
          <Col xs={6}>
            <Row>
              <span className="fw-bold">Due Date</span>
              <span>
                {new Date(invoice?.dueDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default QuickFacts;
