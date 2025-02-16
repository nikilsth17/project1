import React from "react";
import { Col, Row } from "reactstrap";

const CurrencyDisplay = ({ position, currency, commaSeparation, value }) => {
  return (
    <Row>
      <Col className={`text-${position}`}>
        {commaSeparation
          ? currency + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : currency + value}
      </Col>
    </Row>
  );
};

export default CurrencyDisplay;
