import React from "react";

import CountUp from "react-countup";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";

const CardComponent = ({ item}) => {
  return (
    <Col md={6} lg={4}>
       <Link to={item.link} className="text-decoration-underline text-white-50">
      <Card className={"card-animate bg-" + item.cardColor}>
        <CardBody>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 overflow-hidden">
              <p className="text-uppercase fw-bold text-white-50 text-truncate mb-0">
                {item.label}
              </p>
            </div>
            <div className="flex-shrink-0">
              <h5 className={"fs-14 mb-0 text-white"}>
                {item.badge ? (
                  <i className={"fs-13 align-middle " + item.badge}></i>
                ) : null}{" "}
                {item.percentage} 
              </h5>
            </div>
          </div>
          <div className="d-flex align-items-end justify-content-between mt-4">
            <div>
              <h4 className="fs-22 fw-bold ff-secondary mb-4 text-white">
                <span className="counter-value" data-target="559.25">
                  <CountUp
                    start={0}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    separator={item.separator}
                    end={item.counter}
                    decimals={item.decimals}
                    duration={4}
                  />
                </span>
              </h4>
             
              
        
            </div>
            <div className="avatar-sm flex-shrink-0">
              <span
                className={`avatar-title bg-white bg-opacity-10 rounded fs-3`}
              >
                <i className={`text-white ${item.icon}`}></i>
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
      </Link>
    </Col>
  );
};

export default CardComponent;
