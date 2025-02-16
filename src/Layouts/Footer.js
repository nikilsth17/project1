import React from "react";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer d-none">
        <Container fluid>
          <Row>
            <Col sm={12}>
              <div
                className="text-sm text-end d-none d-sm-block"
                style={{ fontSize: "13px" }}
              >
                Design & Develop by SEBS
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
