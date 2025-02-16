import React from "react";
import { Card, Col, Container, Row } from "reactstrap";

const PriceBreakDown = ({ result, shipment }) => {
  return (
    <Container className="mt-3">
      <h5 className="text-secondary">Price BreakDown</h5>
      <Card className="px-0">
        {shipment?.shipmentPriceBreakdowns?.length === 0 ? (
          <Row className="justify-content-center align-items-center">
            <Col xs={12} className="text-center">
              <img
                src="/blankdata.png"
                alt="No data available"
                style={{
                  width: "250px",
                  height: "200px",
                }}
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <div className="table-responsive">
              <table className="table align-middle table-nowrap table-striped-columns">
                <thead>
                  <tr>
                    <th>
                      <span className="fw-bold fs-6">Charge</span>
                    </th>
                    <th>
                      <span className="fw-bold fs-6">Cost</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Row>
                        <Col xs={12}>
                          <p>Service Charge</p>
                        </Col>
                      </Row>
                    </td>
                    <td>
                      <p>${(Math.ceil(result.price * 100) / 100).toFixed(2)}</p>
                    </td>
                  </tr>
                  {result.overSizeCost !== 0 && (
                    <tr>
                      <td>
                        <Row>
                          <Col xs={12}>
                            <p>Oversize Cost</p>
                          </Col>
                        </Row>
                      </td>
                      <td>
                        <p>$ {result.overSizeCost}</p>
                      </td>
                    </tr>
                  )}
                  {result.overWeightCost !== 0 && (
                    <tr>
                      <td>
                        <Row>
                          <Col xs={12}>
                            <p>Overweight Cost</p>
                          </Col>
                        </Row>
                      </td>
                      <td>
                        <p>$ {result.overWeightCost}</p>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>
                      <Row>
                        <Col xs={12}>
                          <p>GST Amount</p>
                        </Col>
                      </Row>
                    </td>
                    <td>
                      <p>$ {result.gstAmt}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Row>
        )}
      </Card>
    </Container>
  );
};

export default PriceBreakDown;
