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

const GLDisplay = (props) => {
  const location = useLocation();

  const [GeneralDetails, setGeneralDetails] = useState(
    props.myPropViewData || []
  );

  useEffect(() => {
    console.log("Value for showing in my page form: ", props.myPropViewData);
    setGeneralDetails(props.myPropViewData);
  }, [props]);

  const cardStyle = {
    backgroundColor: "white" /* Grey background color */,

    padding: "20px" /* Add padding for spacing */,
  };

  const labelStyle = {
    fontWeight: "bold" /* Make labels bold */,
  };

  return (
    <Row>
      <Col md={{ size: 8, offset: 2 }}>
        <Card style={cardStyle}>
          <CardBody>
            <CardTitle tag="h2" className="text-center mb-4">
              General Ledger Details
            </CardTitle>
            <CardText>
              <Row>
                <Col md={3} style={labelStyle}>
                  Name:{" "}
                </Col>
                <Col md={9}>{GeneralDetails.glName}</Col>
              </Row>
              <Row>
                <Col md={3} style={labelStyle}>
                  Code:{" "}
                </Col>
                <Col md={9}>{GeneralDetails.code}</Col>
              </Row>
              <Row>
                <Col md={3} style={labelStyle}>
                  Parent GL:{" "}
                </Col>
                <Col md={9}>{GeneralDetails.parentGLName}</Col>
              </Row>
              <Row>
                <Col md={3} style={labelStyle}>
                  General Ledger:{" "}
                </Col>
                <Col md={9}>{GeneralDetails.glTypeName}</Col>
              </Row>
              <Row>
                <Col md={3} style={labelStyle}>
                  Description:{" "}
                </Col>
                <Col md={9}>{GeneralDetails.description}</Col>
              </Row>
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default GLDisplay;
