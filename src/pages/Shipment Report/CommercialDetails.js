import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const CommercialDetails = ({ shipment }) => {
  const initialValue = 0;
  const initialQuantity = 0;
  const totalQuantity = shipment?.itemContent.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.quantity),
    initialQuantity
  );

  const totalValue = shipment?.itemContent.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.value),
    initialValue
  );

  return (
    <Row>
      {/* <h5 style={{ color: "#556AAE" }}>Commercial Invoice</h5> */}
      <h5 style={{ color: "#556AAE" }}>Customs Information</h5>
      <div className="px-4 p-0">
        <Col lg={12}>
          <Card className="table-responsive table-card mt-1 mb-1">
            <table className="table align-middle table-nowrap">
              <thead style={{ backgroundColor: "#556AAE", color: "white" }}>
                <tr>
                  <th>Item Type</th>
                  <th>Country of Origin</th>
                  <th>Value</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>HS Tariff Code</th>
                </tr>
              </thead>
              <tbody>
                {shipment?.itemContent.map((item) => {
                  return (
                    <tr>
                      <td>{item.description}</td>
                      <td>{item.countryName}</td>
                      <td>${item.value}</td>
                      <td>{item.quantity}</td>
                      <td>${Number(item.value) * Number(item.quantity)}</td>
                      <td>{item.tariff_code}</td>
                    </tr>
                  );
                })}

                <tr>
                  <td>
                    Total value of the goods ({totalQuantity} Items): $
                    {totalValue}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </Col>
      </div>
    </Row>
  );
};

export default CommercialDetails;
