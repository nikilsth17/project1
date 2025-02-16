import React from "react";
import { Card, Col, Row } from "reactstrap";

const BookedPackageDetails = ({ shipment, calculateVolume }) => {
  return (
    <Row>
      <h5 style={{ color: "#556AAE" }}> Booked Package Details</h5>
      <div className="px-4 p-0">
        <Col lg={12}>
          <Card className="table-responsive table-card mt-1 mb-2">
            <table className="table align-middle table-nowrap">
              <thead style={{ backgroundColor: "#556AAE", color: "white" }}>
                <tr>
                  <th>S.N</th>

                  <th className="text-center">PackageType</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Weight</th>
                  <th className="text-center" style={{ width: "20rem" }}>
                    Dimensions (L X W X H)
                  </th>
                  <th className="text-center">Volume</th>
                </tr>
              </thead>
              <tbody>
                {shipment.items &&
                  shipment.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-start">{index + 1}</td>
                      <td className="text-center">{item.packageType}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{item.weight}</td>

                      <td>
                        <Row>
                          <Col xs={4} className="text-center">
                            {item.length}
                          </Col>
                          <Col xs={4} className="text-center">
                            {item.width}
                          </Col>
                          <Col xs={4} className="text-center">
                            {item.height}
                          </Col>
                        </Row>
                      </td>
                      <td className="text-center">{calculateVolume(item)}</td>
                    </tr>
                  ))}
                <tr>
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td className="text-center">
                    {shipment.items &&
                      shipment.items.reduce(
                        (total, item) => total + item.weight,
                        0
                      )}
                  </td>

                  <td className="text-center">
                    <Row>
                      <Col>
                        {shipment._unit === 1 ? (
                          <span className="fs-6">
                            Dimensions in Centimetres
                          </span>
                        ) : (
                          <span>Dimensions in Inches</span>
                        )}
                      </Col>
                    </Row>
                  </td>
                  <td className="text-center">
                    {" "}
                    {Number(shipment.totalVolume).toFixed(3)}
                    <span>
                      {shipment._unit === 1 ? (
                        <span>
                          m<sup>3</sup>
                        </span>
                      ) : (
                        <span>
                          inch<sup>3</sup>
                        </span>
                      )}
                    </span>
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

export default BookedPackageDetails;
