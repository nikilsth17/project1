import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";

const LEDisplay = (props) => {
  const location = useLocation();

  const [LedgerDetails, setLedgerDetails] = useState(
    props.myPropViewData || []
  );

  useEffect(() => {
    console.log("Value for showing in my page form: ", props.myPropViewData);
    setLedgerDetails(props.myPropViewData);
  }, [props]);

  return (
    <Row>
      <Col md={{ size: 8, offset: 2 }}>
        <Card>
          <CardBody>
            <CardTitle tag="h2" className="text-center mb-4">
              Ledger Details
            </CardTitle>
            <CardText>
              <Row>
                <Col md={3}>Ledger: </Col>
                <Col md={9}>{LedgerDetails.ledgerName}</Col>
              </Row>

              <Row>
                <Col md={3}>Code: </Col>
                <Col md={9}>{LedgerDetails.code}</Col>
              </Row>
              <Row>
                <Col md={3}>Parent GL: </Col>
                <Col md={9}>{LedgerDetails.parentGLName}</Col>
              </Row>
              <Row>
                <Col md={3}>GL Type: </Col>
                <Col md={9}>{LedgerDetails.glTypeName}</Col>
              </Row>
              <Row>
                <Col md={3}>Description: </Col>
                <Col md={9}>{LedgerDetails.description}</Col>
              </Row>
              <Row>
                <Col md={3}>Balance: </Col>
                <Col md={9}>{LedgerDetails.balance}</Col>
              </Row>
              <Row>
                <Col md={3}>Status: </Col>
                <Col md={9}>{LedgerDetails.status ? "True" : "False"}</Col>
              </Row>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default LEDisplay;
