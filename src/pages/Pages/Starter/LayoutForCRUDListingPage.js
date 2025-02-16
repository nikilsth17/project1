import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';

  import LayoutWithBreadCrumb from './LayoutWithBreadCrumb';


const LayoutForCRUDListingPage = (props) => {

  return (
    <React.Fragment>
      <LayoutWithBreadCrumb title={props.title} pageTitle={props.pageTitle}>
        <Card id="MainDataList">
          <CardHeader>
            <div className="d-flex align-items-center">
              <h5 className="card-title mb-0 flex-grow-1 fs-17">{props.title}</h5>
              <div className="flex-shrink-0">
                <div className="d-flex gap-2 flex-wrap">
                  {typeof (props.handleAddNew) === "function" &&
                    <Button
                      onClick={props.handleAddNew}
                      className="btn btn-success"
                    >
                      <i className="ri-add-line align-bottom me-1"></i> Create
                      {props.title}
                    </Button>
                  }
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {props.children}
          </CardBody>
        </Card>
      </LayoutWithBreadCrumb>
    </React.Fragment>
  );
};

export default LayoutForCRUDListingPage;