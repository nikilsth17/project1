import React from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Container,
  Button,
} from "reactstrap";
import PeopleIcon from "../../assets/icons/PeopleIcon";
import TruckIcon from "../../assets/icons/TruckIcon";

const Icon = ({ setFilterOptions }) => {
  return (
    <div>
      <CardBody>
        <Row>
          <Col lg={12}>
            <Card className="mt-5">
              <Row>
                <Col lg={1} className="text-center">
                  <h1
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterOptions("notdelivered");
                    }}
                  ></h1>

                  <div>Not Delivered</div>
                </Col>

                <Col lg={1} className="text-center">
                  <h1
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterOptions("waitingcollection");
                    }}
                  ></h1>
                  <div>Waiting Collection</div>
                </Col>

                <Col lg={1} className="text-center">
                  <h1
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterOptions("intransit");
                    }}
                  ></h1>
                  <div>In Transit</div>
                </Col>

                <Col lg={1} className="text-center">
                  <h1
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterOptions("delivering");
                    }}
                  ></h1>
                  <div> Delivering</div>
                </Col>

                <Col lg={1} className="text-center">
                  <h1
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterOptions("delivered");
                    }}
                  ></h1>
                  <div> Delivered</div>
                </Col>

                <Col lg={1} className="text-center">
                  {/* <Button onClick={handleCancel}> */}
                  <h1
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterOptions("cancelled");
                    }}
                  ></h1>
                  <div> Cancelled</div>
                  {/* </Button> */}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col lg={1}></Col>
        </Row>
      </CardBody>
    </div>
  );
};

export default Icon;
