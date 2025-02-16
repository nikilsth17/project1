import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';


const LayoutWithBreadCrumb = (props) => {

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title={props.title} pageTitle={props.pageTitle} />
          <Row>
            <Col lg={12}>
              {props.children}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LayoutWithBreadCrumb;